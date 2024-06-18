
import { ProductDeleteRes, ProductListRes, ProductOptionDeleteRes, ProductOptionRes, ProductRes, ProductVariantDeleteRes, ProductVariantListRes, ProductVariantRes } from "@/types/api-responses"
import { CreateProductOptionReq, CreateProductReq, CreateProductVariantReq, UpdateProductOptionReq, UpdateProductReq, UpdateProductVariantBatchReq, UpdateProductVariantReq } from "@/types/api-payloads"

import { deleteRequest, getRequest, postRequest } from "./common"

async function retrieveProduct(id: string, query?: Record<string, any>) {
  return getRequest<ProductRes>(`/products/${id}`, query)
}

async function listProducts(query?: Record<string, any>) {
  return getRequest<ProductListRes>(`/products`, query)
}

async function createProduct(payload: CreateProductReq) {
  return postRequest<ProductRes>("/products", payload)
}

async function updateProduct(id: string, payload: UpdateProductReq) {
  return postRequest<ProductRes>(`/products/${id}`, payload)
}

async function deleteProduct(id: string) {
  return deleteRequest<ProductDeleteRes>(`/products/${id}`)
}

async function createProductOption(productId: string, payload: CreateProductOptionReq) {
  return postRequest<ProductOptionRes>(`/products/${productId}/options`, payload)
}

async function updateProductOption(productId: string, optionId: string, payload: UpdateProductOptionReq) {
  return postRequest<ProductOptionRes>(`/products/${productId}/options/${optionId}`, payload)
}

async function deleteProductOption(productId: string, optionId: string) {
  return deleteRequest<ProductOptionDeleteRes>(`/products/${productId}/options/${optionId}`)
}

async function createProductVariant(productId: string, payload: CreateProductVariantReq) {
  return postRequest<ProductVariantRes>(`/products/${productId}/product-variants`, payload)
}

async function updateProductVariant(productId: string, variantId: string, payload: UpdateProductVariantReq) {
  return postRequest<ProductVariantRes>(`/products/${productId}/product-variants/${variantId}`, payload)
}

async function updateProductVariants(productId: string, payload: UpdateProductVariantBatchReq) {
  return postRequest<ProductVariantListRes>(`/products/${productId}/product-variants`, payload)
}

async function deleteProductVariant(productId: string, variantId: string) {
  return deleteRequest<ProductVariantDeleteRes>(`/products/${productId}/product-variants/${variantId}`)
}

export const products = {
  list: listProducts,
  retrieve: retrieveProduct,
  create: createProduct,
  update: updateProduct,
  delete: deleteProduct,

  // Product Options
  createOption: createProductOption,
  updateOption: updateProductOption,
  deleteOption: deleteProductOption,

  // Product Variants
  createVariant: createProductVariant,
  updateVariant: updateProductVariant,
  updateVariantBatch: updateProductVariants,
  deleteVariant: deleteProductVariant,
}
