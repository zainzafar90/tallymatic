import httpStatus from 'http-status';
import { IOptions, ListResponse } from '@shared';

import { ApiError } from '@/common/errors/ApiError';

import { paginate } from '../paginate/paginate';
import { IProductCategory, NewCreatedProductCategory } from './product-category.interfaces';
import { ProductCategory } from './product-category.model';

export const createProductCategory = async (productCategoryBody: NewCreatedProductCategory): Promise<IProductCategory> => {
  const productCategory = await ProductCategory.create(productCategoryBody);
  return productCategory.toJSON();
};

export const queryProductCategories = async (
  filter: Record<string, any>,
  options: IOptions
): Promise<ListResponse<ProductCategory>> => {
  const result = await paginate(ProductCategory, filter, options);
  return result;
};

export const getProductCategoryById = async (id: string): Promise<IProductCategory | null> => {
  const productCategory = await ProductCategory.findByPk(id);
  return productCategory ? productCategory.toJSON() : null;
};

export const deleteProductCategoryById = async (productCategoryId: string): Promise<IProductCategory | null> => {
  const productCategory = await ProductCategory.findByPk(productCategoryId);
  if (!productCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product category association not found');
  }
  await productCategory.destroy();
  return productCategory.toJSON();
};
