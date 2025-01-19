import { and, asc, count, desc, eq, ilike } from 'drizzle-orm';
import { IOptions, ListResponse } from '@repo/shared';

import { db } from '@/db';
import { products, variants } from '@/db/schema';

import { getPaginationConfig } from '../paginate/pagination';
import { productService } from '../product';

type OrderDirection = 'asc' | 'desc';
type OrderField = keyof (typeof variants)['_']['columns'];

interface OrderParams {
  field: OrderField;
  direction: OrderDirection;
}

export const queryProductVariants = async (
  filter: Record<string, any>,
  options: IOptions,
  organizationId: string,
  wildcardFields: string[] = []
): Promise<ListResponse<typeof variants.$inferSelect>> => {
  const { limit, offset } = getPaginationConfig(options);

  const conditions = [eq(variants.organizationId, organizationId)];

  if (filter.name) {
    conditions.push(ilike(variants.name, `%${filter.name}%`));
  }
  if (filter.sku) {
    conditions.push(ilike(variants.sku, `%${filter.sku}%`));
  }
  if (filter.status) {
    conditions.push(eq(variants.status, filter.status));
  }

  const whereClause = and(...conditions);

  const orderParams: OrderParams = {
    field: (options.sortBy as OrderField) || 'createdAt',
    direction: (options.sortOrder as OrderDirection) || 'desc',
  };

  const orderFn = orderParams.direction === 'asc' ? asc : desc;
  const orderByClause = orderFn(variants[orderParams.field as keyof (typeof variants)['_']['columns']]);

  const [variantsCount] = await db
    .select({ count: count(variants.id) })
    .from(variants)
    .where(whereClause);

  const results = await db.query.variants.findMany({
    where: whereClause,
    limit,
    offset,
    orderBy: orderByClause,
    with: {
      product: {
        with: {
          category: true,
        },
      },
    },
  });

  return {
    results,
    limit,
    offset,
    pages: Math.ceil(variantsCount.count / limit),
    count: variantsCount.count,
  };
};
