import { CategoryListResponse, CategoryResponse } from '@shared';

import { getRequest } from './common';

async function retrieveCategory(id: string, query?: Record<string, any>) {
  return getRequest<CategoryResponse>(`/v1/categories/${id}`, query);
}

async function listCategories(query?: Record<string, any>) {
  return getRequest<CategoryListResponse>(`/v1/categories`, query);
}

export const categories = {
  retrieve: retrieveCategory,
  list: listCategories,
};
