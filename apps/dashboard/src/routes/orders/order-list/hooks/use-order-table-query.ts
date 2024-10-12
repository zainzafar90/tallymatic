import { useQueryParams } from '@/hooks/use-query-params';

export const useOrderTableQuery = ({ pageSize = 10 }) => {
  const queryObject = useQueryParams(['offset', 'sortBy', 'number', 'status']);

  const { offset, sortBy, number, status } = queryObject;

  const searchParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    sortBy: sortBy || 'createdAt:desc',
    number,
    status,
  };

  return {
    searchParams,
    raw: queryObject,
  };
};
