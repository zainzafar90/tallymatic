/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductListResponse } from '@shared';
import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { client } from '@/lib/client';
import { FetchError } from '@/lib/is-fetch-error';
import { createQueryKeys } from '@/lib/query-key-factory';

export const productsQueryKeys = createQueryKeys('products');

export const useProducts = (
  query?: Record<string, any>,
  options?: Omit<UseQueryOptions<ProductListResponse, FetchError, ProductListResponse, QueryKey>, 'queryFn' | 'queryKey'>
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.products.list(query),
    queryKey: productsQueryKeys.list(query),
    ...options,
  });

  return { ...data, ...rest };
};
