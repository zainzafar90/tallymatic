import { CreateSupplierReq, SupplierListResponse, SupplierResponse, UpdateSupplierReq } from '@shared';
import { QueryKey, useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { client } from '@/lib/client';
import { FetchError } from '@/lib/is-fetch-error';
import { queryClient } from '@/lib/query-client';
import { queryKeysFactory } from '@/lib/query-key-factory';

const SUPPLIERS_QUERY_KEY = 'suppliers' as const;
export const suppliersQueryKeys = queryKeysFactory(SUPPLIERS_QUERY_KEY);

export const useSuppliers = (
  query?: Record<string, any>,
  options?: Omit<UseQueryOptions<SupplierListResponse, FetchError, SupplierListResponse, QueryKey>, 'queryFn' | 'queryKey'>
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.suppliers.list(query),
    queryKey: suppliersQueryKeys.list(query),
    ...options,
  });

  return { ...data, ...rest };
};

export const useCreateSupplier = (options?: UseMutationOptions<SupplierResponse, Error, CreateSupplierReq>) => {
  return useMutation({
    mutationFn: (payload: CreateSupplierReq) => client.suppliers.create(payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: suppliersQueryKeys.lists() });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useUpdateSupplier = (id: string, options?: UseMutationOptions<SupplierResponse, Error, UpdateSupplierReq>) => {
  return useMutation({
    mutationFn: (payload: UpdateSupplierReq) => client.suppliers.update(id, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: suppliersQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: suppliersQueryKeys.detail(data.id) });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useDeleteSupplier = (id: string, options?: UseMutationOptions<void, Error, void>) => {
  return useMutation({
    mutationFn: () => client.suppliers.delete(id),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: suppliersQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: suppliersQueryKeys.detail(id) });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useBulkDeleteSuppliers = (options?: UseMutationOptions<void, Error, string[]>) => {
  return useMutation({
    mutationFn: (ids: string[]) => client.suppliers.bulkDelete(ids),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: suppliersQueryKeys.lists() });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
