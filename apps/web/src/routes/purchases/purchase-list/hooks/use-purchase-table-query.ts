import { useQueryParams } from '@/hooks/use-query-params';

export const usePurchaseTableQuery = ({ pageSize = 10 }) => {
  const queryObject = useQueryParams(['offset', 'sortBy', 'sortOrder', 'supplierId', 'status', 'purchaseNumber']);

  const { offset, sortBy, sortOrder, supplierId, status, purchaseNumber } = queryObject;

  const searchParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    sortBy: sortBy || 'createdAt',
    sortOrder: sortOrder || 'desc',
    purchaseNumber,
    supplierId,
    status,
  };

  return {
    searchParams,
    raw: queryObject,
  };
};
