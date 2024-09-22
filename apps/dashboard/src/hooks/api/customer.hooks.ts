import { CreateCustomerReq, CustomerListResponse, CustomerResponse, UpdateCustomerReq } from '@shared';
import { QueryKey, useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { client } from '@/lib/client';
import { FetchError } from '@/lib/is-fetch-error';
import { queryClient } from '@/lib/query-client';
import { queryKeysFactory } from '@/lib/query-key-factory';

const CUSTOMERS_QUERY_KEY = 'customers' as const;
export const customersQueryKeys = queryKeysFactory(CUSTOMERS_QUERY_KEY);

export const useCustomers = (
  query?: Record<string, any>,
  options?: Omit<UseQueryOptions<CustomerListResponse, FetchError, CustomerListResponse, QueryKey>, 'queryFn' | 'queryKey'>
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.customers.list(query),
    queryKey: customersQueryKeys.list(query),
    ...options,
  });

  return { ...data, ...rest };
};

export const useCreateCustomer = (options?: UseMutationOptions<CustomerResponse, Error, CreateCustomerReq>) => {
  return useMutation({
    mutationFn: (payload: CreateCustomerReq) => client.customers.create(payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: customersQueryKeys.lists() });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useUpdateCustomer = (id: string, options?: UseMutationOptions<CustomerResponse, Error, UpdateCustomerReq>) => {
  return useMutation({
    mutationFn: (payload: UpdateCustomerReq) => client.customers.update(id, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: customersQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customersQueryKeys.detail(data.id) });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useDeleteCustomer = (id: string, options?: UseMutationOptions<void, Error, void>) => {
  return useMutation({
    mutationFn: () => client.customers.delete(id),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: customersQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customersQueryKeys.detail(id) });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useBulkDeleteCustomers = (options?: UseMutationOptions<void, Error, string[]>) => {
  return useMutation({
    mutationFn: (ids: string[]) => client.customers.bulkDelete(ids),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: customersQueryKeys.lists() });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
