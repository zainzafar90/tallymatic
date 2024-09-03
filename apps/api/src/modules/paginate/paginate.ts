import { FindAndCountOptions, Model, ModelStatic, Op } from 'sequelize';
import { IOptions, ListResponse } from '@shared';

import { logger } from '@/common/logger';

export const transformPagination = <T extends Model>(
  count: number,
  rows: T[],
  offset: number,
  limit: number
): ListResponse<T> => {
  const pages = Math.ceil(count / limit);
  return { pages, count, offset, limit, results: rows };
};

export const buildPaginationOptions = (
  filter: Record<string, any>,
  options: IOptions = {},
  wildcardFields: string[] = []
): FindAndCountOptions => {
  const limit = Math.max(options.limit ? +options.limit : 10, 1);
  const offset = options.offset ? +options.offset : 0;

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
    : { exclude: ['createdAt', 'updatedAt', 'deletedAt'] };

  const where = {};
  for (const [key, value] of Object.entries(filter)) {
    if (wildcardFields.includes(key)) {
      where[key] = { [Op.iLike]: `%${value}%` };
    } else {
      where[key] = value;
    }
  }

  return {
    where,
    limit,
    offset,
    distinct: true,
    order: sort,
    attributes,
  };
};

export const paginate = async <T extends Model>(
  model: ModelStatic<T>,
  filter: Record<string, any>,
  options: IOptions = {},
  wildcardFields: string[] = []
): Promise<ListResponse<T>> => {
  const findAndCountOptions = buildPaginationOptions(filter, options, wildcardFields);

  try {
    const { rows, count } = await model.findAndCountAll(findAndCountOptions);
    return transformPagination(count, rows, findAndCountOptions.offset, findAndCountOptions.limit);
  } catch (error) {
    logger.error(`Failed to paginate model: ${error.message}`);
    logger.error(`Error stack: ${error.stack}`);
    throw error;
  }
};
