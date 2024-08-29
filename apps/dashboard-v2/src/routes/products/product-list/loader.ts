import { ProductListResponse } from '@shared';
import { QueryClient } from '@tanstack/react-query';

import { client } from '@/lib/client';
import { queryClient } from '@/lib/query-client';

import { productsQueryKeys } from '../../../hooks/api/products';

const productsListQuery = () => ({
  queryKey: productsQueryKeys.list({ limit: 20, offset: 0 }),
  queryFn: async () => client.products.list({ limit: 20, offset: 0 }),
});

export const productsLoader = (client: QueryClient) => {
  return async () => {
    const query = productsListQuery();

    return queryClient.getQueryData<ProductListResponse>(query.queryKey) ?? (await client.fetchQuery(query));
  };
};
