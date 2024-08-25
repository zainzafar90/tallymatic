import httpStatus from 'http-status';

import { ApiError } from '@/common/errors/ApiError';

import { paginate } from '../paginate/paginate';
import { IOptions, QueryResult } from '../paginate/paginate.types';
import { IProductVariant, NewCreatedProductVariant, UpdateProductVariantBody } from './product-variant.interfaces';
import { ProductVariant } from './product-variant.model';

export const createProductVariant = async (variantBody: NewCreatedProductVariant): Promise<IProductVariant> => {
  const variant = await ProductVariant.create(variantBody);
  return variant.toJSON();
};

export const queryProductVariants = async (
  filter: Record<string, any>,
  options: IOptions
): Promise<QueryResult<ProductVariant>> => {
  const result = await paginate(ProductVariant, filter, options);
  return result;
};

export const getProductVariantById = async (id: string): Promise<IProductVariant | null> => {
  const variant = await ProductVariant.findByPk(id);
  return variant ? variant.toJSON() : null;
};

export const updateProductVariantById = async (
  variantId: string,
  updateBody: UpdateProductVariantBody
): Promise<IProductVariant | null> => {
  const variant = await ProductVariant.findByPk(variantId);
  if (!variant) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product variant not found');
  }
  Object.assign(variant, updateBody);
  await variant.save();
  return variant.toJSON();
};

export const deleteProductVariantById = async (variantId: string): Promise<IProductVariant | null> => {
  const variant = await ProductVariant.findByPk(variantId);
  if (!variant) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product variant not found');
  }
  await variant.destroy();
  return variant.toJSON();
};
