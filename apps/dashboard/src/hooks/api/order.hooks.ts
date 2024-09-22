import { OrderListResponse, OrderResponse, UpdateOrderReq } from '@shared';
import { QueryKey, useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { client } from '@/lib/client';
import { FetchError } from '@/lib/is-fetch-error';
import { queryClient } from '@/lib/query-client';
import { queryKeysFactory } from '@/lib/query-key-factory';

const ORDERS_QUERY_KEY = 'orders' as const;
export const ordersQueryKeys = queryKeysFactory(ORDERS_QUERY_KEY);

export const useOrders = (
  query?: Record<string, any>,
  options?: Omit<UseQueryOptions<OrderListResponse, FetchError, OrderListResponse, QueryKey>, 'queryFn' | 'queryKey'>
) => {
  const { data, ...rest } = useQuery({
    queryKey: ordersQueryKeys.list(query),
    queryFn: () => client.orders.list(query),
    ...options,
  });

  return { ...data, ...rest };
};

export const useOrder = (id: string, options?: UseQueryOptions<OrderResponse, FetchError>) => {
  return useQuery({
    queryKey: ordersQueryKeys.detail(id),
    queryFn: () => client.orders.retrieve(id),
    ...options,
  });
};

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: client.orders.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersQueryKeys.lists() });
    },
  });
};

export const useUpdateOrder = (id: string) => {
  return useMutation({
    mutationFn: (data: UpdateOrderReq) => client.orders.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ordersQueryKeys.detail(id) });
    },
  });
};

export const useDeleteOrder = (id: string) => {
  return useMutation({
    mutationFn: () => client.orders.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersQueryKeys.lists() });
    },
  });
};

export const useBulkDeleteOrders = (options?: UseMutationOptions<void, Error, string[]>) => {
  return useMutation({
    mutationFn: (ids: string[]) => client.customers.bulkDelete(ids),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ordersQueryKeys.lists() });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
