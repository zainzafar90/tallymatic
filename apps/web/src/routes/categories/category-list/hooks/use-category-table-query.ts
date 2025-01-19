import { Status } from '@repo/shared';

import { useQueryParams } from '@/hooks/use-query-params';

type UseCategoryTableQueryProps = {
  pageSize?: number;
};

const DEFAULT_PAGE_SIZE = 10;

export const useCategoryTableQuery = ({ pageSize = DEFAULT_PAGE_SIZE }: UseCategoryTableQueryProps) => {
  const queryObject = useQueryParams(['offset', 'sortBy', 'sortOrder', 'name', 'createdAt', 'updatedAt', 'status']);

  const { offset, sortBy, sortOrder, name, createdAt, updatedAt, status } = queryObject;

  const searchParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    sortBy: sortBy || 'createdAt',
    sortOrder: sortOrder || 'desc',
    createdAt: createdAt ? JSON.parse(createdAt) : undefined,
    updatedAt: updatedAt ? JSON.parse(updatedAt) : undefined,
    status: status?.split(',') as Status[],
    name,
  };

  return {
    searchParams,
    raw: queryObject,
  };
};
