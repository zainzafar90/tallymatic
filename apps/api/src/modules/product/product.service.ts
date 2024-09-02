import httpStatus from 'http-status';
import { CreateProductReq, IOptions, IProduct, ListResponse, UpdateProductReq } from '@shared';

import { ApiError } from '@/common/errors/api-error';

import { paginate } from '../paginate';
import { ProductVariant } from '../product-variant/product-variant.model';
import { Product } from './product.model';

export const createProduct = async (productBody: CreateProductReq): Promise<IProduct> => {
  const { variants, ...productData } = productBody;

  const product = await Product.create(productData);

  if (variants && variants.length > 0) {
    const variantsWithProductId = variants.map((variant) => ({
      ...variant,
      productId: product.id,
    }));
    await ProductVariant.bulkCreate(variantsWithProductId);
  }

  const createdProduct = await Product.findByPk(product.id, {
    include: [{ model: ProductVariant, as: 'variants' }],
  });

  return createdProduct.toJSON();
};

export const queryProducts = async (
  filter: Record<string, any>,
  options: IOptions,
  wildcardFields: string[] = []
): Promise<ListResponse<Product>> => {
  const result = await paginate(Product, filter, options, wildcardFields, [{ model: ProductVariant, as: 'variants' }]);
  return result;
};

export const getProductById = async (id: string): Promise<IProduct | null> => {
  const product = await Product.findByPk(id, {
    include: [{ model: ProductVariant, as: 'variants' }],
  });
  return product ? product.toJSON() : null;
};

export const updateProductById = async (productId: string, updateBody: UpdateProductReq): Promise<IProduct | null> => {
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
