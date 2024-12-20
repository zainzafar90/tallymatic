import { and, asc, count, desc, eq, ilike } from 'drizzle-orm';
import { IOptions } from '@repo/shared';

import { logger } from '@/common/logger';
import { db } from '@/db';
import { products } from '@/db/schema';

import { cacheManager } from './product.cache';

type OrderDirection = 'asc' | 'desc';
type OrderField = keyof (typeof products)['_']['columns'];

export function buildQueryConditions(filter: Record<string, any>, organizationId: string, wildcardFields: string[]) {
  const conditions = [eq(products.organizationId, organizationId)];

  if (filter.name && wildcardFields.includes('name')) {
    conditions.push(ilike(products.name, `%${filter.name}%`));
  }
  if (filter.status) {
    conditions.push(eq(products.status, filter.status));
  }

  return and(...conditions);
}

export function buildOrderByClause(options: IOptions) {
  const field = (options.sortBy as OrderField) || 'createdAt';
  const direction = (options.sortOrder as OrderDirection) || 'desc';
  const orderFn = direction === 'asc' ? asc : desc;

  return orderFn(products[field]);
}

export async function getProductCount(
  conditions: any,
  organizationId: string,
  filter: Record<string, any>
): Promise<number> {
  const hasFilters = Boolean(filter.name || filter.status);

  if (hasFilters) {
    logger.info(`Skipping cache due to filters: ${JSON.stringify(filter)}`);
  }

  if (!hasFilters) {
    const cachedCount = await cacheManager.getProductCount(organizationId);
    if (cachedCount !== null) {
      return cachedCount;
    }
  }

  logger.info(`Fetching fresh count from database for org: ${organizationId}`);
  const [{ count: freshCount }] = await db
    .select({ count: count(products.id) })
    .from(products)
    .where(conditions);

  if (!hasFilters) {
    await cacheManager.setProductCount(organizationId, freshCount);
  }

  return freshCount;
}
