import { and, asc, desc, eq, inArray, sql } from 'drizzle-orm';
import httpStatus from 'http-status';
import { InventoryAdjustmentType, IOptions, TransactionType } from '@repo/shared';

import { ApiError } from '@/common/errors/api-error';
import { db } from '@/db';
import { Inventory, inventory, inventoryHistory, products, variants } from '@/db/schema';

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

export const adjustStock = async ({
  variantId,
  quantity,
  type,
  organizationId,
  storeId,
  userId,
  referenceId,
  notes,
}: {
  variantId: string;
  quantity: number;
  type: TransactionType;
  organizationId: string;
  storeId: string;
  userId: string;
  referenceId?: string;
  notes?: string;
}) => {
  return db.transaction(async (tx) => {
    const productVariant = await tx.query.variants.findFirst({
      where: and(eq(variants.id, variantId), eq(variants.organizationId, organizationId), eq(variants.storeId, storeId)),
    });

    if (!productVariant) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product variant not found');
    }

    const currentStock = Number(productVariant.stock);
    const newStock = currentStock + quantity;

    if (newStock < 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient stock');
    }

    await tx
      .update(variants)
      .set({ stock: newStock } as any)
      .where(eq(variants.id, variantId));

    const [inventoryCreated] = await tx
      .insert(inventory)
      .values({
        variantId,
        quantity,
        type,
        storeId,
        notes,
      } as any)
      .returning();

    let adjustmentType: InventoryAdjustmentType;
    switch (type) {
      case TransactionType.SOLD:
        adjustmentType = InventoryAdjustmentType.SALE;
        break;
      case TransactionType.RECEIVED:
        adjustmentType = InventoryAdjustmentType.PURCHASE;
        break;
      case TransactionType.ADJUSTED:
        adjustmentType = InventoryAdjustmentType.MANUAL_ADJUSTMENT;
        break;
      default:
        adjustmentType = InventoryAdjustmentType.MANUAL_ADJUSTMENT;
    }

    await tx.insert(inventoryHistory).values({
      variantId,
      storeId,
      quantity,
      previousQuantity: currentStock,
      newQuantity: newStock,
      adjustmentType,
      referenceId,
      notes,
      createdBy: userId,
    } as any);

    return inventoryDTO(inventoryCreated);
  });
};

export const createClaimAdjustment = async (variantId: string, quantity: number, organizationId: string, notes?: string) => {
  return adjustStock({
    variantId,
    quantity,
    type: TransactionType.ADJUSTED,
    organizationId,
    storeId: '',
    userId: '',
    notes,
  });
};

export const recordPurchaseReceived = async ({
  variantId,
  quantity,
  organizationId,
  storeId,
  userId,
  purchaseId,
  notes,
}: {
  variantId: string;
  quantity: number;
  organizationId: string;
  storeId: string;
  userId: string;
  purchaseId: string;
  notes?: string;
}) => {
  return adjustStock({
    variantId,
    quantity,
    type: TransactionType.RECEIVED,
    organizationId,
    storeId,
    userId,
    referenceId: purchaseId,
    notes: notes || 'Purchase received',
  });
};

export const recordSale = async ({
  variantId,
  quantity,
  organizationId,
  storeId,
  userId,
  orderId,
  notes,
}: {
  variantId: string;
  quantity: number;
  organizationId: string;
  storeId: string;
  userId: string;
  orderId: string;
  notes?: string;
}) => {
  return adjustStock({
    variantId,
    quantity: -Math.abs(quantity), // Ensure negative quantity for sales
    type: TransactionType.SOLD,
    organizationId,
    storeId,
    userId,
    referenceId: orderId,
    notes: notes || 'Sale completed',
  });
};

export const recordManualAdjustment = async (
  variantId: string,
  quantity: number,
  organizationId: string,
  storeId: string,
  userId: string,
  notes?: string
) => {
  return adjustStock({
    variantId,
    quantity,
    type: TransactionType.ADJUSTED,
    organizationId,
    storeId,
    userId,
    referenceId: undefined,
    notes: notes || 'Manual stock adjustment',
  });
};

export const getAllInventoryLevels = async (
  filter: Record<string, any>,
  options: IOptions,
  organizationId: string,
  storeId: string,
  wildcardFields: string[] = []
) => {
  const { limit, offset } = getPaginationConfig(options);

  const conditions = [eq(products.organizationId, organizationId), eq(products.storeId, storeId)];

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

  const variantIds = results.map((variant) => variant.id);

  const inventoryHistoryResults = await db
    .select({
      id: inventoryHistory.id,
      variantId: inventoryHistory.variantId,
      quantity: inventoryHistory.quantity,
      previousQuantity: inventoryHistory.previousQuantity,
      newQuantity: inventoryHistory.newQuantity,
      adjustmentType: inventoryHistory.adjustmentType,
      referenceId: inventoryHistory.referenceId,
      notes: inventoryHistory.notes,
      createdAt: inventoryHistory.createdAt,
      createdBy: inventoryHistory.createdBy,
    })
    .from(inventoryHistory)
    .where(inArray(inventoryHistory.variantId, variantIds))
    .orderBy(desc(inventoryHistory.createdAt));

  const historyByVariant = inventoryHistoryResults.reduce(
    (acc, history) => {
      if (!acc[history.variantId]) {
        acc[history.variantId] = [];
      }
      acc[history.variantId].push(history);
      return acc;
    },
    {} as Record<string, typeof inventoryHistoryResults>
  );

  const resultsWithHistory = results.map((variant) => ({
    ...variant,
    history: historyByVariant[variant.id] || [],
  }));

  return {
    results: resultsWithHistory,
    limit,
    offset,
    pages: Math.ceil(variantsCount.count / limit),
    count: variantsCount.count,
  };
};
