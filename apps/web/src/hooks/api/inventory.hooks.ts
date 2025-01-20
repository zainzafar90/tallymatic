import { InventoryLevelsResponse } from '@repo/shared';
import { QueryKey, useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { client } from '@/lib/client';
import { FetchError } from '@/lib/is-fetch-error';
import { queryClient } from '@/lib/query-client';

import { productsQueryKeys } from './products.hooks';

const INVENTORY_QUERY_KEY = 'inventory' as const;
export const inventoryQueryKeys = {
  lists: () => [INVENTORY_QUERY_KEY],
  list: (query?: Record<string, any>) => [INVENTORY_QUERY_KEY, query],
  detail: (id: string) => [INVENTORY_QUERY_KEY, id],
};

export const useAdjustStock = (options?: UseMutationOptions<any, Error, any>) => {
  return useMutation({
    mutationFn: client.inventory.adjustStock,
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: inventoryQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.lists() });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useAllInventoryLevels = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<InventoryLevelsResponse, FetchError, InventoryLevelsResponse, QueryKey>,
    'queryFn' | 'queryKey'
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.inventory.getAllInventoryLevels(query),
    queryKey: inventoryQueryKeys.list(query),
    ...options,
  });

  return { ...data, ...rest };
};
