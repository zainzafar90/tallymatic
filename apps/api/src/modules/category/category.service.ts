import httpStatus from 'http-status';
import { CreateCategoryReq, ICategory, IOptions, ListResponse, UpdateCategoryReq } from '@shared';

import { ApiError } from '@/common/errors/api-error';
import { getDatabaseInstance } from '@/database/db';

import { buildPaginationOptions, transformPagination } from '../paginate/paginate';
import { Category } from './category.model';

export const createCategory = async (categoryBody: CreateCategoryReq): Promise<ICategory> => {
  const category = await Category.create(categoryBody);
  return category.toJSON();
};

export const queryCategories = async (
  filter: Record<string, any>,
  options: IOptions,
  wildcardFields: string[] = []
): Promise<ListResponse<Category>> => {
  const paginationOptions = buildPaginationOptions(filter, options, wildcardFields);

  const result = await Category.findAndCountAll({
    ...paginationOptions,
    paranoid: !options.includeDeleted,
  });
  return transformPagination(result.count, result.rows, paginationOptions.offset, paginationOptions.limit);
};

export const getCategoryById = async (id: string, includeDeleted = false): Promise<ICategory | null> => {
  const category = await Category.findByPk(id, { paranoid: !includeDeleted });
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

// TODO: not used yet in the app
export const permanentlyDeleteCategoryById = async (categoryId: string): Promise<ICategory | null> => {
  const category = await Category.findByPk(categoryId, { paranoid: false });
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  await category.destroy({ force: true });
  return category.toJSON();
};

export const bulkDeleteCategories = async (categoryIds: string[]): Promise<ICategory[]> => {
  const transaction = await getDatabaseInstance().transaction();
  try {
    const categories = await Category.findAll({
      where: { id: categoryIds },
      transaction,
    });

    if (categories.length !== categoryIds.length) {
      throw new Error('One or more category IDs are invalid');
    }

    await Category.destroy({
      where: { id: categoryIds },
      transaction,
    });

    await transaction.commit();

    return categories.map((category) => category.toJSON());
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Error in bulkDeleteCategories:', error);
    throw error;
  }
};
