import { ProductListResponse } from '@shared';

import {
  CreateProductOptionReq,
  CreateProductReq,
  CreateProductVariantReq,
  UpdateProductOptionReq,
  UpdateProductReq,
  UpdateProductVariantBatchReq,
  UpdateProductVariantReq,
} from '@/types/api-payloads';
import {
  ProductDeleteRes,
  ProductOptionDeleteRes,
  ProductOptionRes,
  ProductRes,
  ProductVariantDeleteRes,
  ProductVariantListRes,
  ProductVariantRes,
} from '@/types/api-responses';

import { deleteRequest, getRequest, postRequest } from './common';

async function retrieveProduct(id: string, query?: Record<string, any>) {
  return getRequest<ProductRes>(`/v1/products/${id}`, query);
}

async function listProducts(query?: Record<string, any>) {
  return getRequest<ProductListResponse>(`/v1/products`, query);
}

async function createProduct(payload: CreateProductReq) {
  return postRequest<ProductRes>('/v1/products', payload);
}

async function updateProduct(id: string, payload: UpdateProductReq) {
  return postRequest<ProductRes>(`/v1/products/${id}`, payload);
}

async function deleteProduct(id: string) {
  return deleteRequest<ProductDeleteRes>(`/v1/products/${id}`);
}

async function createProductOption(productId: string, payload: CreateProductOptionReq) {
  return postRequest<ProductOptionRes>(`/v1/products/${productId}/options`, payload);
}

async function updateProductOption(productId: string, optionId: string, payload: UpdateProductOptionReq) {
  return postRequest<ProductOptionRes>(`/v1/products/${productId}/options/${optionId}`, payload);
}

async function deleteProductOption(productId: string, optionId: string) {
  return deleteRequest<ProductOptionDeleteRes>(`/v1/products/${productId}/options/${optionId}`);
}

async function createProductVariant(productId: string, payload: CreateProductVariantReq) {
  return postRequest<ProductVariantRes>(`/v1/products/${productId}/product-variants`, payload);
}

async function updateProductVariant(productId: string, variantId: string, payload: UpdateProductVariantReq) {
  return postRequest<ProductVariantRes>(`/v1/products/${productId}/product-variants/${variantId}`, payload);
}

async function updateProductVariants(productId: string, payload: UpdateProductVariantBatchReq) {
  return postRequest<ProductVariantListRes>(`/v1/products/${productId}/product-variants`, payload);
}

async function deleteProductVariant(productId: string, variantId: string) {
  return deleteRequest<ProductVariantDeleteRes>(`/v1/products/${productId}/product-variants/${variantId}`);
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
};
