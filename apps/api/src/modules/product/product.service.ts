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
    const product = await Product.create(
      {
        ...productData,
        categoryId: productData.categoryId ?? null,
      },
      { transaction }
    );

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
  const transaction = await getDatabaseInstance().transaction();

  try {
    const product = await Product.findByPk(productId, { transaction });
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }

    const { variants, ...productData } = updateBody;

    Object.assign(product, {
      ...productData,
      categoryId: productData.categoryId ?? null,
    });
    await product.save({ transaction });

    if (variants) {
      await ProductVariant.destroy({ where: { productId }, transaction });

      if (variants.length > 0) {
        const variantsWithProductId = variants.map((variant) => ({
          ...variant,
          productId,
        }));
        await ProductVariant.bulkCreate(variantsWithProductId, { transaction });
      }
    }

    const updatedProduct = await Product.findByPk(productId, {
      include: [
        { model: ProductVariant, as: 'variants' },
        { model: Category, as: 'category' },
      ],
      transaction,
    });

    await transaction.commit();

    return updatedProduct.toJSON();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const deleteProductById = async (productId: string): Promise<IProduct | null> => {
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  await product.destroy();
  return product.toJSON();
};

export const bulkDeleteProducts = async (productIds: string[]): Promise<IProduct[]> => {
  const transaction = await getDatabaseInstance().transaction();
  try {
    const products = await Product.findAll({
      where: { id: productIds },
      transaction,
    });

    if (products.length !== productIds.length) {
      throw new Error('One or more product IDs are invalid');
    }

    await Product.destroy({
      where: { id: productIds },
      transaction,
    });

    await transaction.commit();

    return products.map((product) => product.toJSON());
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Error in bulkDeleteProducts:', error);
    throw error;
  }
};
