import { and, asc, desc, eq, lte, sql } from 'drizzle-orm';
import httpStatus from 'http-status';
import { IOptions, TransactionType } from '@repo/shared';

import { ApiError } from '@/common/errors/api-error';
import { db } from '@/db';
import { Inventory, inventory, products, variants } from '@/db/schema';

import { getPaginationConfig } from '../paginate/pagination';

type OrderDirection = 'asc' | 'desc';
type OrderField = keyof (typeof variants)['_']['columns'];

interface OrderParams {
  field: OrderField;
  direction: OrderDirection;
}

const inventoryDTO = (inventory: Inventory) => {
  return inventory;
};

export const createClaimAdjustment = async (variantId: string, quantity: number, organizationId: string, notes?: string) => {
  return adjustStock(variantId, quantity, TransactionType.ADJUSTED, organizationId, notes);
};

export const getAllInventoryLevels = async (
  filter: Record<string, any>,
  options: IOptions,
  organizationId: string,
  wildcardFields: string[] = []
) => {
  const { limit, offset } = getPaginationConfig(options);

  const conditions = [eq(products.organizationId, organizationId)];

  if (filter.name) {
    conditions.push(
      wildcardFields.includes('name') ? sql`${products.name} ILIKE ${`%${filter.name}%`}` : eq(products.name, filter.name)
    );
  }

  const whereClause = and(...conditions);

  const orderParams: OrderParams = {
    field: (options.sortBy as OrderField) || 'createdAt',
    direction: (options.sortOrder as OrderDirection) || 'desc',
  };

  const orderFn = orderParams.direction === 'asc' ? asc : desc;
  const orderByClause = orderFn(variants[orderParams.field as keyof (typeof variants)['_']['columns']]);

  const [variantsCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(variants)
    .innerJoin(products, eq(variants.productId, products.id))
    .where(whereClause);

  const results = await db
    .select({
      id: variants.id,
      name: variants.name,
      sku: variants.sku,
      stock: variants.stock,
      lowStockThreshold: variants.lowStockThreshold,
      reorderPoint: variants.reorderPoint,
      reorderQuantity: variants.reorderQuantity,
      productName: products.name,
    })
    .from(variants)
    .innerJoin(products, eq(variants.productId, products.id))
    .where(whereClause)
    .limit(limit)
    .offset(offset)
    .orderBy(orderByClause);

  return {
    results,
    limit,
    offset,
    pages: Math.ceil(variantsCount.count / limit),
    count: variantsCount.count,
  };
};

export const adjustStock = async (
  variantId: string,
  quantity: number,
  type: TransactionType,
  organizationId: string,
  storeId: string,
  notes?: string
) => {
  return db.transaction(async (tx) => {
    const [productsAndVariants] = await tx
      .select()
      .from(variants)
      .innerJoin(products, eq(variants.productId, products.id))
      .where(and(eq(variants.id, variantId), eq(products.organizationId, organizationId)))
      .limit(1);

    if (!productsAndVariants) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product variant not found');
    }

    const newStock = Number(productsAndVariants.variants.stock) + quantity;
    if (newStock < 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient stock');
    }

    const updateStock = {
      stock: newStock,
    };

    await tx
      .update(variants)
      // TODO: Fix this type error
      .set(updateStock as any)
      .where(eq(variants.id, variantId));

    const [inventoryCreated] = await tx
      .insert(inventory)
      .values({
        variantId,
        quantity,
        type,
        storeId,
      })
      .returning();

    return inventoryDTO(inventoryCreated);
  });
};
