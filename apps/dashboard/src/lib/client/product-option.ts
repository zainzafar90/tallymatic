import { getRequest } from "./common"
import { ProductOptionListRes, ProductOptionRes } from "@/types/api-responses"

async function retrieveProductOption(id: string, query?: Record<string, any>) {
  return getRequest<ProductOptionRes>(`/product-options/${id}`, query)
}

async function listProductOptions(query?: Record<string, any>) {
  return getRequest<{ product_options: ProductOptionListRes }>(`/product-options`, query)
}

export const productOptions = {
  retrieve: retrieveProductOption,
  list: listProductOptions,
}
