import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"

import { queryKeysFactory } from "@/lib/query-key-factory"
import { client } from "@/lib/client"
import { ProductTypeListRes, ProductTypeRes } from "@/types/api-responses"

const PRODUCT_TYPES_QUERY_KEY = "product_types" as const
const productTypesQueryKeys = queryKeysFactory(PRODUCT_TYPES_QUERY_KEY)

export const useProductType = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      { product_type: ProductTypeRes },
      Error,
      { product_type: ProductTypeRes },
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.productTypes.retrieve(id, query),
    queryKey: productTypesQueryKeys.detail(id),
    ...options,
  })

  return { ...data, ...rest }
}

export const useProductTypes = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      { product_types: ProductTypeListRes },
      Error,
      { product_types: ProductTypeListRes },
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.productTypes.list(query),
    queryKey: productTypesQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}
