import { and, count, eq, ilike } from 'drizzle-orm';
import { IOptions, ListResponse } from '@shared';

import { db } from '@/db';
import { variants } from '@/db/schema';

import { getPaginationConfig } from '../paginate/pagination';

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

  const [variantsCount] = await db.select({ count: count() }).from(variants).where(whereClause);

  const results = await db.query.variants.findMany({
    where: whereClause,
    limit,
    offset,
    orderBy: variants.productId,
    with: {
      product: true,
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
