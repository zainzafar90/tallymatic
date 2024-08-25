import httpStatus from 'http-status';

import { ApiError } from '@/common/errors/ApiError';

import { paginate } from '../paginate/paginate';
import { IOptions, QueryResult } from '../paginate/paginate.types';
import { IProduct, NewCreatedProduct, UpdateProductBody } from './product.interfaces';
import { Product } from './product.model';

export const createProduct = async (productBody: NewCreatedProduct): Promise<IProduct> => {
  const product = await Product.create(productBody);
  return product.toJSON();
};

export const queryProducts = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult<Product>> => {
  const result = await paginate(Product, filter, options);
  return result;
};

export const getProductById = async (id: string): Promise<IProduct | null> => {
  const product = await Product.findByPk(id);
  return product ? product.toJSON() : null;
};

export const updateProductById = async (productId: string, updateBody: UpdateProductBody): Promise<IProduct | null> => {
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  Object.assign(product, updateBody);
  await product.save();
  return product.toJSON();
};

export const deleteProductById = async (productId: string): Promise<IProduct | null> => {
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  await product.destroy();
  return product.toJSON();
};
