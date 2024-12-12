import { useQueryParams } from '@/hooks/use-query-params';

export const usePurchaseTableQuery = ({ pageSize = 10 }) => {
  const queryObject = useQueryParams(['offset', 'sortBy', 'supplierId', 'status']);

  const { offset, sortBy, supplierId, status } = queryObject;

  const searchParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    sortBy: sortBy || 'createdAt:desc',
    supplierId,
    status,
  };

  return {
    searchParams,
    raw: queryObject,
  };
};
