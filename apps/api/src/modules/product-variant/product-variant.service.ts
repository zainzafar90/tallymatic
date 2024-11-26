import { Op, WhereOptions } from 'sequelize';
import { IOptions, ListResponse } from '@shared';

import { buildPaginationOptions, transformPagination } from '../paginate/paginate';
import { Product } from '../product/product.model';
import { ProductVariant } from './product-variant.model';

export const queryProductVariants = async (
  filter: Record<string, any>,
  options: IOptions,
  wildcardFields: string[] = []
): Promise<ListResponse<ProductVariant>> => {
  const paginationOptions = buildPaginationOptions(filter, options, wildcardFields);

  const variantWhere: WhereOptions = {};
  if (filter.name) {
    variantWhere.name = { [Op.iLike]: `%${filter.name}%` };
  }
  if (filter.sku) {
    variantWhere.sku = { [Op.iLike]: `%${filter.sku}%` };
  }
  if (filter.status) {
    variantWhere.status = filter.status;
  }

  const productWhere: WhereOptions = {};
  if (filter.productName) {
    productWhere.name = { [Op.iLike]: `%${filter.productName}%` };
  }

  const result = await ProductVariant.findAndCountAll({
    ...paginationOptions,
    where: variantWhere,
    include: [
      {
        model: Product,
        as: 'product',
        where: productWhere,
        required: Object.keys(productWhere).length > 0,
      },
    ],
    order: [['productId', 'ASC']],
  });

  return transformPagination(result.count, result.rows, paginationOptions.offset, paginationOptions.limit);
};
