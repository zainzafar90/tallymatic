import httpStatus from 'http-status';
import { CreateProductOptionReq, IOptions, IProductOption, ListResponse, UpdateProductOptionReq } from '@shared';

import { ApiError } from '@/common/errors/ApiError';

import { paginate } from '../paginate/paginate';
import { ProductOption } from './product-option.model';

export const createProductOption = async (
  productId: string,
  optionBody: CreateProductOptionReq
): Promise<IProductOption> => {
  const option = await ProductOption.create({ ...optionBody, productId });
  return option.toJSON();
};

export const queryProductOptions = async (
  productId: string,
  filter: Record<string, any>,
  options: IOptions
): Promise<ListResponse<ProductOption>> => {
  const finalFilter = { ...filter, productId };
  const result = await paginate(ProductOption, finalFilter, options);
  return result;
};

export const getProductOptionById = async (productId: string, optionId: string): Promise<IProductOption | null> => {
  const option = await ProductOption.findOne({ where: { id: optionId, productId } });
  return option ? option.toJSON() : null;
};

export const updateProductOptionById = async (
  productId: string,
  optionId: string,
  updateBody: UpdateProductOptionReq
): Promise<IProductOption | null> => {
  const option = await ProductOption.findOne({ where: { id: optionId, productId } });
  if (!option) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product option not found');
  }
  Object.assign(option, updateBody);
  await option.save();
  return option.toJSON();
};

export const deleteProductOptionById = async (productId: string, optionId: string): Promise<IProductOption | null> => {
  const option = await ProductOption.findOne({ where: { id: optionId, productId } });
  if (!option) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product option not found');
  }
  await option.destroy();
  return option.toJSON();
};
