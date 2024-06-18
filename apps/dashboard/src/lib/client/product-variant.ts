import { getRequest } from "./common"
import { ProductVariantListRes, ProductVariantRes } from "@/types/api-responses"

async function retrieveProductVariant(productId: string, variantId: string, query?: Record<string, any>) {
  return getRequest<{ product_variant: ProductVariantRes }>(`/products/${productId}/product-variants/${variantId}`, query)
}

async function listProductVariants(productId: string, query?: Record<string, any>) {
  return getRequest<{ product_variants: ProductVariantListRes }>(`/products/${productId}/product-variants`, query)
}

export const productVariants = {
  retrieve: retrieveProductVariant,
  list: listProductVariants,
}
