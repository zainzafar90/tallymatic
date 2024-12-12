/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreatePurchaseReq, PurchaseDeleteResponse, PurchaseListResponse, PurchaseResponse, UpdatePurchaseReq } from '@shared';
import { QueryKey, useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { client } from '@/lib/client';
import { FetchError } from '@/lib/is-fetch-error';
import { queryClient } from '@/lib/query-client';
import { queryKeysFactory } from '@/lib/query-key-factory';

const PURCHASES_QUERY_KEY = 'purchases' as const;
export const purchasesQueryKeys = queryKeysFactory(PURCHASES_QUERY_KEY);

export const usePurchases = (
  query?: Record<string, any>,
  options?: Omit<UseQueryOptions<PurchaseListResponse, FetchError, PurchaseListResponse, QueryKey>, 'queryFn' | 'queryKey'>
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.purchases.list(query),
    queryKey: purchasesQueryKeys.list(query),
    ...options,
  });

  return { ...data, ...rest };
};

export const useCreatePurchase = (options?: UseMutationOptions<PurchaseResponse, Error, CreatePurchaseReq>) => {
  return useMutation({
    mutationFn: (payload: CreatePurchaseReq) => client.purchases.create(payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: purchasesQueryKeys.lists() });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useUpdatePurchase = (id: string, options?: UseMutationOptions<PurchaseResponse, Error, PurchaseResponse>) => {
  return useMutation({
    mutationFn: (payload: UpdatePurchaseReq) => client.purchases.update(id, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: purchasesQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: purchasesQueryKeys.detail(data.id) });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useDeletePurchase = (
  id: string,
  options?: UseMutationOptions<PurchaseDeleteResponse, FetchError, PurchaseDeleteResponse>
) => {
  return useMutation({
    mutationFn: () => client.purchases.delete(id),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: purchasesQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: purchasesQueryKeys.detail(id) });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useBulkDeletePurchases = (options?: UseMutationOptions<PurchaseDeleteResponse[], FetchError, string[]>) => {
  return useMutation({
    mutationFn: (ids: string[]) => client.purchases.bulkDelete(ids),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: purchasesQueryKeys.lists() });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
