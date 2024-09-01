import { Status } from '@shared';

import { useQueryParams } from '@/hooks/use-query-params';

type UseProductTableQueryProps = {
  pageSize?: number;
};

const DEFAULT_PAGE_SIZE = 10;

export const useProductTableQuery = ({ pageSize = DEFAULT_PAGE_SIZE }: UseProductTableQueryProps) => {
  const queryObject = useQueryParams(['offset', 'sortBy', 'name', 'created_at', 'updated_at', 'status', 'id']);

  const { offset, sortBy, created_at, updated_at, status, name } = queryObject;

  const searchParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    sortBy: sortBy || 'createdAt:desc',
    created_at: created_at ? JSON.parse(created_at) : undefined,
    updated_at: updated_at ? JSON.parse(updated_at) : undefined,
    status: status?.split(',') as Status[],
    name,
  };

  return {
    searchParams,
    raw: queryObject,
  };
};
