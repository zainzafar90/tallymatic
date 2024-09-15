import httpStatus from 'http-status';
import { CreateProductReq, IOptions, IProduct, ListResponse, UpdateProductReq } from '@shared';

import { ApiError } from '@/common/errors/api-error';
import { getDatabaseInstance } from '@/database/db';

import { Category } from '../category';
import { buildPaginationOptions, transformPagination } from '../paginate/paginate';
import { ProductVariant } from '../product-variant/product-variant.model';
import { Product } from './product.model';

export const createProduct = async (productBody: CreateProductReq): Promise<IProduct> => {
  const { variants, ...productData } = productBody;

  const transaction = await getDatabaseInstance().transaction();

  try {
    const product = await Product.create(productData, { transaction });

    if (variants && variants.length > 0) {
      const variantsWithProductId = variants.map((variant) => ({
        ...variant,
        productId: product.id,
      }));
      await ProductVariant.bulkCreate(variantsWithProductId, { transaction });
    }

    const createdProduct = await Product.findByPk(product.id, {
      include: [
        { model: ProductVariant, as: 'variants' },
        { model: Category, as: 'category' },
      ],
      transaction,
    });

    await transaction.commit();

    return createdProduct.toJSON();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const queryProducts = async (
  filter: Record<string, any>,
  options: IOptions,
  wildcardFields: string[] = []
): Promise<ListResponse<Product>> => {
  const paginationOptions = buildPaginationOptions(filter, options, wildcardFields);
  const result = await Product.findAndCountAll({
    ...paginationOptions,
    include: [
      { model: ProductVariant, as: 'variants' },
      { model: Category, as: 'category' },
    ],
  });

  const results = transformPagination(result.count, result.rows, paginationOptions.offset, paginationOptions.limit);
  return results;
};

export const getProductById = async (id: string): Promise<IProduct | null> => {
  const product = await Product.findByPk(id, {
    include: [
      { model: ProductVariant, as: 'variants' },
      { model: Category, as: 'category' },
    ],
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
