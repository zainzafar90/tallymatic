/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductVariantListResponse } from '@shared';
import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { client } from '@/lib/client';
import { FetchError } from '@/lib/is-fetch-error';
import { queryKeysFactory } from '@/lib/query-key-factory';

const VARIANTS_QUERY_KEY = 'variants' as const;
export const variantsQueryKeys = queryKeysFactory(VARIANTS_QUERY_KEY);

export const useVariants = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<ProductVariantListResponse, FetchError, ProductVariantListResponse, QueryKey>,
    'queryFn' | 'queryKey'
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.variants.list(query),
    queryKey: variantsQueryKeys.list(query),
    ...options,
  });

  return { ...data, ...rest };
};
