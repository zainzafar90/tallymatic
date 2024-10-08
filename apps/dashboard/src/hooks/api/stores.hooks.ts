import { MutationOptions, QueryKey, useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { queryKeysFactory } from '@/lib/query-key-factory';

import { client } from '../../lib/client';
import { queryClient } from '../../lib/query-client';
import { UpdateStoreReq } from '../../types/api-payloads';
import { StoreRes } from '../../types/api-responses';

const STORES_QUERY_KEY = 'stores' as const;
export const storeQueryKeys = queryKeysFactory(STORES_QUERY_KEY);

export const useStore = (
  id: string,
  options?: Omit<UseQueryOptions<StoreRes, Error, StoreRes, QueryKey>, 'queryFn' | 'queryKey'>
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

export const useUpdateStore = (id: string, options?: MutationOptions<StoreRes, Error, UpdateStoreReq>) => {
  return useMutation({
    mutationFn: (payload) => client.stores.update(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.detail(id) });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
