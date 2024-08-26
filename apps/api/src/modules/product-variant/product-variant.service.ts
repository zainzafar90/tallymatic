import httpStatus from 'http-status';
import { CreateProductVariantReq, IOptions, IProductVariant, ListResponse, UpdateProductVariantReq } from '@shared';

import { ApiError } from '@/common/errors/api-error';

import { paginate } from '../paginate/paginate';
import { ProductVariant } from './product-variant.model';

export const createProductVariant = async (
  productId: string,
  variantBody: CreateProductVariantReq
): Promise<IProductVariant> => {
  const variant = await ProductVariant.create({ ...variantBody, productId });
  return variant.toJSON();
};

export const queryProductVariants = async (
  productId: string,
  filter: Record<string, any>,
  options: IOptions
): Promise<ListResponse<ProductVariant>> => {
  const finalFilter = { ...filter, productId };
  const result = await paginate(ProductVariant, finalFilter, options);
  return result;
};

export const getProductVariantById = async (productId: string, variantId: string): Promise<IProductVariant | null> => {
  const variant = await ProductVariant.findOne({ where: { id: variantId, productId } });
  return variant ? variant.toJSON() : null;
};

export const updateProductVariantById = async (
  productId: string,
  variantId: string,
  updateBody: UpdateProductVariantReq
): Promise<IProductVariant | null> => {
  const variant = await ProductVariant.findOne({ where: { id: variantId, productId } });
  if (!variant) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product variant not found');
  }
  Object.assign(variant, updateBody);
  await variant.save();
  return variant.toJSON();
};

export const deleteProductVariantById = async (productId: string, variantId: string): Promise<IProductVariant | null> => {
  const variant = await ProductVariant.findOne({ where: { id: variantId, productId } });
  if (!variant) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product variant not found');
  }
  await variant.destroy();
  return variant.toJSON();
};
