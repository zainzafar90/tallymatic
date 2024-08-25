import httpStatus from 'http-status';

import { ApiError } from '@/common/errors/ApiError';

import { paginate } from '../paginate/paginate';
import { IOptions, QueryResult } from '../paginate/paginate.types';
import { ICategory, NewCreatedCategory, UpdateCategoryBody } from './category.interfaces';
import { Category } from './category.model';

export const createCategory = async (categoryBody: NewCreatedCategory): Promise<ICategory> => {
  const category = await Category.create(categoryBody);
  return category.toJSON();
};

export const queryCategories = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult<Category>> => {
  const result = await paginate(Category, filter, options);
  return result;
};

export const getCategoryById = async (id: string): Promise<ICategory | null> => {
  const category = await Category.findByPk(id);
  return category ? category.toJSON() : null;
};

export const updateCategoryById = async (categoryId: string, updateBody: UpdateCategoryBody): Promise<ICategory | null> => {
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
