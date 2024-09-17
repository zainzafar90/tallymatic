import { CategoryListResponse, CategoryResponse, CreateCategoryReq, UpdateCategoryReq } from '@shared';

import { deleteRequest, getRequest, patchRequest, postRequest } from './common';

async function retrieveCategory(id: string, query?: Record<string, any>) {
  return getRequest<CategoryResponse>(`/v1/categories/${id}`, query);
}

async function listCategories(query?: Record<string, any>) {
  return getRequest<CategoryListResponse>(`/v1/categories`, query);
}

async function createCategory(payload: CreateCategoryReq) {
  return postRequest<CategoryResponse>('/v1/categories', payload);
}

async function updateCategory(id: string, payload: UpdateCategoryReq) {
  return patchRequest<CategoryResponse>(`/v1/categories/${id}`, payload);
}

async function deleteCategory(id: string) {
  return deleteRequest<void>(`/v1/categories/${id}`);
}

async function bulkDeleteCategories(ids: string[]) {
  return deleteRequest<void>(`/v1/categories`, { categoryIds: ids });
}

export const categories = {
  list: listCategories,
  retrieve: retrieveCategory,
  create: createCategory,
  update: updateCategory,
  delete: deleteCategory,
  bulkDelete: bulkDeleteCategories,
};
