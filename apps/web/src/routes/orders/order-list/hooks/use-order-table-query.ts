import { useQueryParams } from '@/hooks/use-query-params';

export const useOrderTableQuery = ({ pageSize = 10 }) => {
  const queryObject = useQueryParams(['offset', 'sortBy', 'sortOrder', 'orderNumber', 'status']);

  const { offset, sortBy, sortOrder, orderNumber, status } = queryObject;

  const searchParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    sortBy: sortBy || 'createdAt',
    sortOrder: sortOrder || 'desc',
    orderNumber,
    status,
  };

  return {
    searchParams,
    raw: queryObject,
  };
};
