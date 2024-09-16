import { CreateProductReq, ProductDeleteResponse, ProductListResponse, ProductResponse, UpdateProductReq } from '@shared';

import { deleteRequest, getRequest, patchRequest, postRequest } from './common';

async function retrieveProduct(id: string, query?: Record<string, any>) {
  return getRequest<ProductResponse>(`/v1/products/${id}`, query);
}

async function listProducts(query?: Record<string, any>) {
  return getRequest<ProductListResponse>(`/v1/products`, query);
}

async function createProduct(payload: CreateProductReq) {
  return postRequest<ProductResponse>('/v1/products', payload);
}

async function updateProduct(id: string, payload: UpdateProductReq) {
  return patchRequest<ProductResponse>(`/v1/products/${id}`, payload);
}

async function deleteProduct(id: string) {
  return deleteRequest<ProductDeleteResponse>(`/v1/products/${id}`);
}

async function bulkDeleteProducts(ids: string[]) {
  return deleteRequest<ProductDeleteResponse[]>(`/v1/products`, { productIds: ids });
}

export const products = {
  list: listProducts,
  retrieve: retrieveProduct,
  create: createProduct,
  update: updateProduct,
  delete: deleteProduct,
  bulkDelete: bulkDeleteProducts,
};
