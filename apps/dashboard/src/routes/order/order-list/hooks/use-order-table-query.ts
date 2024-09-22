import { useQueryParams } from '@/hooks/use-query-params';

export const useOrderTableQuery = ({ pageSize = 10 }) => {
  const queryObject = useQueryParams(['offset', 'sortBy', 'number', 'email', 'financialStatus', 'fulfillmentStatus']);

  const { offset, sortBy, number, email, financialStatus, fulfillmentStatus } = queryObject;

  const searchParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    sortBy: sortBy || 'createdAt:desc',
    number,
    email,
    financialStatus,
    fulfillmentStatus,
  };

  return {
    searchParams,
    raw: queryObject,
  };
};
