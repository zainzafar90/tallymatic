import { CategoryListResponse, CategoryResponse } from '@shared';
import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { client } from '@/lib/client';
import { FetchError } from '@/lib/is-fetch-error';
import { queryKeysFactory } from '@/lib/query-key-factory';

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
