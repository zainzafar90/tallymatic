import { and, asc, count, desc, eq, ilike } from 'drizzle-orm';
import httpStatus from 'http-status';
import { CreateProductReq, IOptions, ListResponse, Status, UpdateProductReq } from '@repo/shared';

import { ApiError } from '@/common/errors/api-error';
import { db } from '@/db';
import { Product, products, variants } from '@/db/schema';

import { getPaginationConfig } from '../paginate/pagination';

type OrderDirection = 'asc' | 'desc';
type OrderField = keyof (typeof products)['_']['columns'];

interface OrderParams {
  field: OrderField;
  direction: OrderDirection;
}

export const createProduct = async (productBody: CreateProductReq, organizationId: string) => {
  return await db.transaction(async (tx) => {
    const { variants: productVariants, ...productData } = productBody;

    const productNew = {
      ...productData,
      organizationId,
      status: Status.ACTIVE,
      categoryId: productData.categoryId ?? null,
    };

    const [product] = await tx.insert(products).values(productNew).returning();

    if (productVariants?.length > 0) {
      const variantsNew = productVariants.map((variant) => ({
        ...variant,
        price: variant.price.toString(),
        productId: product.id,
        organizationId,
        status: Status.ACTIVE,
      }));

      await tx.insert(variants).values(variantsNew);
    }

    const createdProduct = await tx.query.products.findFirst({
      where: eq(products.id, product.id),
      with: {
        variants: true,
        category: true,
      },
    });

    return createdProduct;
  });
};

export const queryProducts = async (
  filter: Record<string, any>,
  options: IOptions,
  organizationId: string,
  wildcardFields: string[] = []
): Promise<ListResponse<typeof products.$inferSelect>> => {
  const { limit, offset } = getPaginationConfig(options);

  const conditions = [eq(products.organizationId, organizationId)];
  if (filter.name && wildcardFields.includes('name')) {
    conditions.push(ilike(products.name, `%${filter.name}%`));
  }
  if (filter.status) {
    conditions.push(eq(products.status, filter.status));
  }

  const whereClause = and(...conditions);

  const orderParams: OrderParams = {
    field: (options.sortBy as OrderField) || 'createdAt',
    direction: (options.sortOrder as OrderDirection) || 'desc',
  };

  const orderFn = orderParams.direction === 'asc' ? asc : desc;
  const orderByClause = orderFn(products[orderParams.field as keyof (typeof products)['_']['columns']]);

  const [productsCount] = await db.select({ count: count() }).from(products).where(whereClause);

  const results = await db.query.products.findMany({
    where: whereClause,
    limit,
    offset,
    orderBy: orderByClause,
    with: {
      variants: true,
      category: true,
    },
  });

  return {
    results,
    limit,
    offset,
    pages: Math.ceil(productsCount.count / limit),
    count: productsCount.count,
  };
};

export const getProductById = async (id: string, organizationId: string) => {
  const product = await db.query.products.findFirst({
    where: and(eq(products.id, id), eq(products.organizationId, organizationId)),
    with: {
      variants: true,
      category: true,
    },
  });
  return product;
};

export const updateProductById = async (productId: string, updateBody: UpdateProductReq, organizationId: string) => {
  return await db.transaction(async (tx) => {
    const product = await tx.query.products.findFirst({
      where: and(eq(products.id, productId), eq(products.organizationId, organizationId)),
    });

    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }

    const { variants: productVariants, ...productData } = updateBody;

    const [updatedProduct] = await tx
      .update(products)
      .set({
        ...productData,
        organizationId,
        categoryId: productData.categoryId ?? null,
      } as Product)
      .where(and(eq(products.id, productId), eq(products.organizationId, organizationId)))
      .returning();

    if (productVariants?.length > 0) {
      await tx.delete(variants).where(eq(variants.productId, productId));

      await tx.insert(variants).values(
        productVariants.map((variant) => ({
          ...variant,
          price: variant.price.toString(),
          productId,
          organizationId,
          status: Status.ACTIVE,
        }))
      );
    }

    return await tx.query.products.findFirst({
      where: eq(products.id, updatedProduct.id),
      with: {
        variants: true,
        category: true,
      },
    });
  });
};

export const deleteProductById = async (productId: string, organizationId: string) => {
  const product = await getProductById(productId, organizationId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const [deletedProduct] = await db
    .delete(products)
    .where(and(eq(products.id, productId), eq(products.organizationId, organizationId)))
    .returning();

  return deletedProduct;
};

export const bulkDeleteProducts = async (productIds: string[], organizationId: string) => {
  return await db.transaction(async (tx) => {
    const existingProducts = await tx.query.products.findMany({
      where: and(
        eq(products.organizationId, organizationId),
        // @ts-expect-error: Type inference issue with array of strings
        products.id.in(productIds)
      ),
    });

    if (existingProducts.length !== productIds.length) {
      throw new Error('One or more product IDs are invalid');
    }

    const deletedProducts = await tx
      .delete(products)
      .where(
        and(
          eq(products.organizationId, organizationId),
          // @ts-expect-error: Type inference issue with array of strings
          products.id.in(productIds)
        )
      )
      .returning();

    return deletedProducts;
  });
};
