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
  const result = await ProductVariant.findAndCountAll({
    ...paginationOptions,
    include: [{ model: Product, as: 'product' }],
  });

  return transformPagination(result.count, result.rows, paginationOptions.offset, paginationOptions.limit);
};
