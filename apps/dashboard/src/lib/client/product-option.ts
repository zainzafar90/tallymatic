import { ProductOptionListRes, ProductOptionRes } from '@/types/api-responses';

import { getRequest } from './common';

async function retrieveProductOption(id: string, query?: Record<string, any>) {
  return getRequest<ProductOptionRes>(`/v1/product-options/${id}`, query);
}

async function listProductOptions(query?: Record<string, any>) {
  return getRequest<{ product_options: ProductOptionListRes }>(`/v1/product-options`, query);
}

export const productOptions = {
  retrieve: retrieveProductOption,
  list: listProductOptions,
};
