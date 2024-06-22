import { FindAndCountOptions, Model, ModelStatic } from 'sequelize';

import { logger } from '@/common/logger';

export interface QueryResult<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface IOptions {
  sortBy?: string;
  projectBy?: string;
  populate?: string;
  limit?: number;
  page?: number;
}

const getLimitAndOffset = (page: number, size: number) => {
  const limit = size ? +size : 10; // default size is 10
  const offset = page ? (page - 1) * limit : 0; // default page is 1
  return { limit, offset };
};

const transformPagination = <T extends Model>(
  data: {
    count: number;
    rows: T[];
  },
  page: number,
  limit: number
): QueryResult<T> => {
  const { count: totalItems, rows } = data;
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalResults: totalItems, results: rows, totalPages, page: currentPage, limit };
};

export const paginate = async <T extends Model>(
  model: ModelStatic<T>,
  filter: Record<string, any>,
  options: IOptions = {}
): Promise<QueryResult<T>> => {
  const page = options.page || 1;
  const size = options.limit || 10;
  const { limit, offset } = getLimitAndOffset(page, size);

  const sort: any[] = options.sortBy
    ? options.sortBy.split(',').map((sortOption) => {
        const [key, order] = sortOption.split(':');
        return [key, order === 'desc' ? 'DESC' : 'ASC'];
      })
    : [['createdAt', 'ASC']];

  const attributes: any = options.projectBy
    ? options.projectBy.split(',').map((projectOption) => {
        const [key, include] = projectOption.split(':');
        return include === 'hide' ? `-${key}` : key;
      })
    : { exclude: ['createdAt', 'updatedAt'] };

  const findAndCountOptions: FindAndCountOptions = {
    where: filter,
    limit,
    offset,
    distinct: true,
    order: sort,
    attributes,
  };

  if (options.populate) {
    findAndCountOptions.include = options.populate.split(',').map((populateOption) => {
      return {
        association: populateOption.split('.').reduce((acc, curr) => {
          return { association: curr, include: acc ? [acc] : [] };
        }, undefined as any),
      };
    });
  }

  try {
    const { rows, count } = await model.findAndCountAll(findAndCountOptions);
    return transformPagination({ count, rows }, page, limit);
  } catch (error) {
    logger.error(`Failed to paginate model: ${error.message}`);
    throw error;
  }
};
