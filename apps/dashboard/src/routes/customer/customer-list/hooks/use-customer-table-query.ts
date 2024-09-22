import { useQueryParams } from '@/hooks/use-query-params';

type UseCustomerTableQueryProps = {
  pageSize?: number;
};

const DEFAULT_PAGE_SIZE = 10;

export const useCustomerTableQuery = ({ pageSize = DEFAULT_PAGE_SIZE }: UseCustomerTableQueryProps) => {
  const queryObject = useQueryParams(['offset', 'sortBy', 'name', 'email', 'phone', 'createdAt', 'updatedAt']);

  const { offset, sortBy, name, email, phone, createdAt, updatedAt } = queryObject;

  const searchParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    sortBy: sortBy || 'createdAt:desc',
    name,
    email,
    phone,
    created_at: createdAt ? JSON.parse(createdAt) : undefined,
    updated_at: updatedAt ? JSON.parse(updatedAt) : undefined,
  };

  return {
    searchParams,
    raw: queryObject,
  };
};
