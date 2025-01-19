import { StoreResponse, UpdateStoreReq } from '@repo/shared';
import { MutationOptions, QueryKey, useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { queryKeysFactory } from '@/lib/query-key-factory';

import { client } from '../../lib/client';
import { queryClient } from '../../lib/query-client';

const STORES_QUERY_KEY = 'stores' as const;
export const storeQueryKeys = queryKeysFactory(STORES_QUERY_KEY);

export const useStore = (
  id: string,
  options?: Omit<UseQueryOptions<StoreResponse, Error, StoreResponse, QueryKey>, 'queryFn' | 'queryKey'>
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.stores.retrieve(),
    queryKey: storeQueryKeys.detail(id),
    ...options,
  });

  return {
    ...data,
    ...rest,
  };
};

export const useUpdateStore = (id: string, options?: MutationOptions<StoreResponse, Error, UpdateStoreReq>) => {
  return useMutation({
    mutationFn: (payload) => client.stores.update(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.detail(id) });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
