import { InventoryLevelsResponse } from '@shared';
import { QueryKey, useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { client } from '@/lib/client';
import { FetchError } from '@/lib/is-fetch-error';
import { queryClient } from '@/lib/query-client';

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
      options?.onSuccess?.(data, variables, context);
    },
  });
};

// export const useInventoryLevels = (productId: string) => {
//   return useQuery({
//     queryKey: ['inventoryLevels', productId],
//     queryFn: () => client.inventory.getInventoryLevels(productId),
//   });
// };

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

export const useLowStockAlerts = () => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.inventory.getLowStockAlerts(),
    queryKey: ['lowStockAlerts'],
  });

  return { ...data, ...rest };
};
