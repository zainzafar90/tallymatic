import { Status } from '@shared';

import { useQueryParams } from '@/hooks/use-query-params';

type UseProductTableQueryProps = {
  pageSize?: number;
};

const DEFAULT_PAGE_SIZE = 10;

export const useProductTableQuery = ({ pageSize = DEFAULT_PAGE_SIZE }: UseProductTableQueryProps) => {
  const queryObject = useQueryParams(['offset', 'sortBy', 'name', 'createdAt', 'updatedAt', 'status', 'id']);

  const { offset, sortBy, createdAt, updatedAt, status, name } = queryObject;

  const searchParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    sortBy: sortBy || 'createdAt:desc',
    created_at: createdAt ? JSON.parse(createdAt) : undefined,
    updated_at: updatedAt ? JSON.parse(updatedAt) : undefined,
    status: status?.split(',') as Status[],
    name,
  };

  return {
    searchParams,
    raw: queryObject,
  };
};
