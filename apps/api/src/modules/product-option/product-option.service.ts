import httpStatus from 'http-status';

import { ApiError } from '@/common/errors/ApiError';

import { paginate } from '../paginate/paginate';
import { IOptions, QueryResult } from '../paginate/paginate.types';
import { IProductOption, NewCreatedProductOption, UpdateProductOptionBody } from './product-option.interfaces';
import { ProductOption } from './product-option.model';

export const createProductOption = async (optionBody: NewCreatedProductOption): Promise<IProductOption> => {
  const option = await ProductOption.create(optionBody);
  return option.toJSON();
};

export const queryProductOptions = async (
  filter: Record<string, any>,
  options: IOptions
): Promise<QueryResult<ProductOption>> => {
  const result = await paginate(ProductOption, filter, options);
  return result;
};

export const getProductOptionById = async (id: string): Promise<IProductOption | null> => {
  const option = await ProductOption.findByPk(id);
  return option ? option.toJSON() : null;
};

export const updateProductOptionById = async (
  optionId: string,
  updateBody: UpdateProductOptionBody
): Promise<IProductOption | null> => {
  const option = await ProductOption.findByPk(optionId);
  if (!option) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product option not found');
  }
  Object.assign(option, updateBody);
  await option.save();
  return option.toJSON();
};

export const deleteProductOptionById = async (optionId: string): Promise<IProductOption | null> => {
  const option = await ProductOption.findByPk(optionId);
  if (!option) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product option not found');
  }
  await option.destroy();
  return option.toJSON();
};
