import { MutationOptions, QueryKey, useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { createQueryKeys } from '@/lib/query-key-factory';

import { client } from '../../lib/client';
import { queryClient } from '../../lib/query-client';
import { UpdateStoreReq } from '../../types/api-payloads';
import { StoreRes } from '../../types/api-responses';

const storeQueryKeys = createQueryKeys('store');

export const useStore = (options?: Omit<UseQueryOptions<StoreRes, Error, StoreRes, QueryKey>, 'queryFn' | 'queryKey'>) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.stores.retrieve(),
    queryKey: storeQueryKeys.detail(),
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
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.detail() });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
