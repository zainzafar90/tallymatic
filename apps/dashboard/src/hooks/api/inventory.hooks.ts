import { InventoryLevelsResponse } from '@shared';
import { QueryKey, useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { client } from '@/lib/client';
import { FetchError } from '@/lib/is-fetch-error';

const INVENTORY_QUERY_KEY = 'inventory' as const;
export const inventoryQueryKeys = {
  list: (query?: Record<string, any>) => [INVENTORY_QUERY_KEY, query],
  detail: (id: string) => [INVENTORY_QUERY_KEY, id],
};

export const useAdjustStock = () => {
  return useMutation({
    mutationFn: client.inventory.adjustStock,
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
  return useQuery({
    queryKey: ['lowStockAlerts'],
    queryFn: client.inventory.getLowStockAlerts,
  });
};
