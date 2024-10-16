import { useQueryParams } from '@/hooks/use-query-params';

export const useOrderTableQuery = ({ pageSize = 10 }) => {
  const queryObject = useQueryParams(['offset', 'sortBy', 'orderNumber', 'status']);

  const { offset, sortBy, orderNumber, status } = queryObject;

  const searchParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    sortBy: sortBy || 'createdAt:desc',
    orderNumber,
    status,
  };

  return {
    searchParams,
    raw: queryObject,
  };
};
