import { ProductVariantListRes, ProductVariantRes } from '@/types/api-responses';

import { getRequest } from './common';

async function retrieveProductVariant(productId: string, variantId: string, query?: Record<string, any>) {
  return getRequest<{ product_variant: ProductVariantRes }>(
    `/v1/products/${productId}/product-variants/${variantId}`,
    query
  );
}

async function listProductVariants(productId: string, query?: Record<string, any>) {
  return getRequest<{ product_variants: ProductVariantListRes }>(`/v1/products/${productId}/product-variants`, query);
}

export const productVariants = {
  retrieve: retrieveProductVariant,
  list: listProductVariants,
};
