/* eslint-disable @typescript-eslint/no-explicit-any */
import { CategoryListResponse, CategoryResponse, CreateCategoryReq, UpdateCategoryReq } from '@shared';
import { QueryKey, useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { client } from '@/lib/client';
import { FetchError } from '@/lib/is-fetch-error';
import { queryClient } from '@/lib/query-client';
import { queryKeysFactory } from '@/lib/query-key-factory';

import { productsQueryKeys } from './products.hooks';

const CATEGORIES_QUERY_KEY = 'categories' as const;
export const categoriesQueryKeys = queryKeysFactory(CATEGORIES_QUERY_KEY);

export const useCategories = (
  query?: Record<string, any>,
  options?: Omit<UseQueryOptions<CategoryListResponse, FetchError, CategoryListResponse, QueryKey>, 'queryFn' | 'queryKey'>
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.categories.list(query),
    queryKey: categoriesQueryKeys.list(query),
    ...options,
  });

  return { ...data, ...rest };
};

export const useCategory = (
  id: string,
  options?: Omit<UseQueryOptions<CategoryResponse, FetchError, CategoryResponse, QueryKey>, 'queryFn' | 'queryKey'>
) => {
  return useQuery({
    queryFn: () => client.categories.retrieve(id),
    queryKey: categoriesQueryKeys.detail(id),
    ...options,
  });
};

export const useCreateCategory = (options?: UseMutationOptions<CategoryResponse, Error, CreateCategoryReq>) => {
  return useMutation({
    mutationFn: (payload: CreateCategoryReq) => client.categories.create(payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.lists() });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useUpdateCategory = (id: string, options?: UseMutationOptions<CategoryResponse, Error, UpdateCategoryReq>) => {
  return useMutation({
    mutationFn: (payload: UpdateCategoryReq) => client.categories.update(id, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.detail(id) });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useDeleteCategory = (id: string, options?: UseMutationOptions<void, Error, void>) => {
  return useMutation({
    mutationFn: () => client.categories.delete(id),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.lists() });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useBulkDeleteCategories = (options?: UseMutationOptions<void, Error, string[]>) => {
  return useMutation({
    mutationFn: (categoryIds: string[]) => client.categories.bulkDelete(categoryIds),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.lists() });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
