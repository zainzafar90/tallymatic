/**
 * Credits: Inspired 100% from
 *
 *  __  __  _____  ____   _   _  ____    _       _  ____
 * |  \/  || ____||  _ \ | | | |/ ___|  / \     | |/ ___|
 * | |\/| ||  _|  | | | || | | |\___ \ / _ \ _  | |\___ \
 * | |  | || |___ | |_| || |_| | ___) / ___ \ |_| | ___) |
 * |_|  |_||_____||____/  \___/ |____/_/   \_\___/ |____/
 */

import { QueryKey, UseQueryOptions } from '@tanstack/react-query';

import { SELECTED_STORE_KEY } from '@/utils/common.utils';

type TQueryKey<TKey, TListQuery = any, TDetailQuery = string> = {
  all: readonly [TKey];
  lists: () => readonly [...TQueryKey<TKey>['all'], 'list', string];
  list: (query?: TListQuery) => readonly [...ReturnType<TQueryKey<TKey>['lists']>, { query: TListQuery | undefined }];
  details: () => readonly [...TQueryKey<TKey>['all'], 'detail', string];
  detail: (
    id: TDetailQuery,
    query?: TListQuery
  ) => readonly [...ReturnType<TQueryKey<TKey>['details']>, TDetailQuery, { query: TListQuery | undefined }];
};

export type UseQueryOptionsWrapper<
  // Return type of queryFn
  TQueryFn = unknown,
  // Type thrown in case the queryFn rejects
  E = Error,
  // Query key type
  TQueryKey extends QueryKey = QueryKey,
> = Omit<UseQueryOptions<TQueryFn, E, TQueryFn, TQueryKey>, 'queryKey' | 'queryFn'>;

export const queryKeysFactory = <T, TListQueryType = any, TDetailQueryType = string>(globalKey: T) => {
  const getStoreId = () => localStorage.getItem(SELECTED_STORE_KEY) || 'no-store';

  const queryKeyFactory: TQueryKey<T, TListQueryType, TDetailQueryType> = {
    all: [globalKey],
    lists: () => [...queryKeyFactory.all, 'list', getStoreId()],
    list: (query?: TListQueryType) => [...queryKeyFactory.lists(), { query }],
    details: () => [...queryKeyFactory.all, 'detail', getStoreId()],
    detail: (id: TDetailQueryType, query?: TListQueryType) => [...queryKeyFactory.details(), id, { query }],
  };
  return queryKeyFactory;
};
