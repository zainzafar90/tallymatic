import httpStatus from 'http-status';
import { CreateCategoryReq, ICategory, IOptions, ListResponse, UpdateCategoryReq } from '@shared';

import { ApiError } from '@/common/errors/ApiError';

import { paginate } from '../paginate/paginate';
import { Category } from './category.model';

export const createCategory = async (categoryBody: CreateCategoryReq): Promise<ICategory> => {
  const category = await Category.create(categoryBody);
  return category.toJSON();
};

export const queryCategories = async (filter: Record<string, any>, options: IOptions): Promise<ListResponse<Category>> => {
  const result = await paginate(Category, filter, options);
  return result;
};

export const getCategoryById = async (id: string): Promise<ICategory | null> => {
  const category = await Category.findByPk(id);
  return category ? category.toJSON() : null;
};

export const updateCategoryById = async (categoryId: string, updateBody: UpdateCategoryReq): Promise<ICategory | null> => {
  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  Object.assign(category, updateBody);
  await category.save();
  return category.toJSON();
};

export const deleteCategoryById = async (categoryId: string): Promise<ICategory | null> => {
  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  await category.destroy();
  return category.toJSON();
};
