import httpStatus from 'http-status';
import { CreateStoreReq, IOptions, IStore, ListResponse, UpdateStoreReq } from '@shared';

import { ApiError } from '@/common/errors/api-error';

import { paginate } from '../paginate/paginate';
import { Store } from './store.model';

/**
 * Create a store
 * @param {CreateStoreReq} storeBody
 * @returns {Promise<IStore>}
 */
export const createStore = async (storeBody: CreateStoreReq): Promise<IStore> => {
  const store = await Store.create(storeBody);
  return store;
};

/**
 * Query for stores
 * @param {Object} filter - filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryStores = async (filter: Record<string, any>, options: IOptions): Promise<ListResponse<Store>> => {
  const result = await paginate(Store, filter, options);
  return result;
};

/**
 * Get store by id
 * @param string id
 * @returns {Promise<IStore | null>}
 */
export const getStoreById = async (id: string): Promise<IStore | null> => {
  const store = await Store.findByPk(id);
  return store ? store.toJSON() : null;
};

/**
 * Update store by id
 * @param {string}} storeId
 * @param {UpdateStoreReq} updateBody
 * @returns {Promise<IStore | null>}
 */
export const updateStoreById = async (storeId: string, updateBody: UpdateStoreReq): Promise<IStore | null> => {
  const store = await Store.findByPk(storeId);
  if (!store) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Store not found');
  }
  Object.assign(store, updateBody);
  await store.save();
  return store.toJSON();
};

/**
 * Delete store by id
 * @param {string} storeId
 * @returns {Promise<IStore | null>}
 */
export const deleteStoreById = async (storeId: string): Promise<IStore | null> => {
  const store = await Store.findByPk(storeId);
  if (!store) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Store not found');
  }
  await store.destroy();
  return store.toJSON();
};
