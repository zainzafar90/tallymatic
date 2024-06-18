import { ProductTypeListRes, ProductTypeRes } from "@/types/api-responses"
import { getRequest } from "./common"

async function listProductTypes(query?: Record<string, any>) {
  return getRequest<{ product_types: ProductTypeListRes }>(
    `/product-types`,
    query
  )
}

async function retrieveProductType(id: string, query?: Record<string, any>) {
  return getRequest<{ product_type: ProductTypeRes }>(
    `/product-types/${id}`,
    query
  )
}

export const productTypes = {
  list: listProductTypes,
  retrieve: retrieveProductType,
}
