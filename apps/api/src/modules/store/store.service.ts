import { and, asc, count, desc, eq } from 'drizzle-orm';
import httpStatus from 'http-status';
import { CreateStoreReq, IOptions, ListResponse, Status, UpdateStoreReq } from '@repo/shared';

import { ApiError } from '@/common/errors/api-error';
import { db } from '@/db';
import { stores } from '@/db/schema';

import { getPaginationConfig } from '../paginate/pagination';

type OrderDirection = 'asc' | 'desc';
type OrderField = keyof (typeof stores)['_']['columns'];

interface OrderParams {
  field: OrderField;
  direction: OrderDirection;
}

export const createStore = async (storeBody: CreateStoreReq, organizationId: string) => {
  const storeNew = {
    ...storeBody,
    organizationId,
    status: Status.ACTIVE,
  };
  const [store] = await db.insert(stores).values(storeNew).returning();
  return store;
};

export const queryStores = async (
  filter: Record<string, any>,
  options: IOptions,
  organizationId: string
): Promise<ListResponse<typeof stores.$inferSelect>> => {
  const { limit, offset } = getPaginationConfig(options);

  const conditions = [eq(stores.organizationId, organizationId)];
  if (filter.name) {
    conditions.push(eq(stores.name, filter.name));
  }

  const whereClause = and(...conditions);

  const orderParams: OrderParams = {
    field: (options.sortBy as OrderField) || 'createdAt',
    direction: (options.sortOrder as OrderDirection) || 'desc',
  };

  const orderFn = orderParams.direction === 'asc' ? asc : desc;
  const orderByClause = orderFn(stores[orderParams.field as keyof (typeof stores)['_']['columns']]);

  const [storesCount] = await db
    .select({ count: count(stores.id) })
    .from(stores)
    .where(whereClause);

  const results = await db.query.stores.findMany({
    where: whereClause,
    limit,
    offset,
    orderBy: orderByClause,
  });

  return {
    results,
    limit,
    offset,
    pages: Math.ceil(storesCount.count / limit),
    count: storesCount.count,
  };
};

export const getStoreById = async (id: string, organizationId: string) => {
  const store = await db.query.stores.findFirst({
    where: and(eq(stores.id, id), eq(stores.organizationId, organizationId)),
  });
  return store;
};

export const updateStoreById = async (storeId: string, updateBody: UpdateStoreReq, organizationId: string) => {
  const store = await getStoreById(storeId, organizationId);
  if (!store) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Store not found');
  }

  const [updatedStore] = await db
    .update(stores)
    .set(updateBody)
    .where(and(eq(stores.id, storeId), eq(stores.organizationId, organizationId)))
    .returning();

  return updatedStore;
};

export const deleteStoreById = async (storeId: string, organizationId: string) => {
  const store = await getStoreById(storeId, organizationId);
  if (!store) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Store not found');
  }

  const [deletedStore] = await db
    .delete(stores)
    .where(and(eq(stores.id, storeId), eq(stores.organizationId, organizationId)))
    .returning();

  return deletedStore;
};
