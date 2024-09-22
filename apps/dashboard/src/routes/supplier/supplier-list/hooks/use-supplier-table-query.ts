import { useQueryParams } from '@/hooks/use-query-params';

type UseSupplierTableQueryProps = {
  pageSize?: number;
};

const DEFAULT_PAGE_SIZE = 10;

export const useSupplierTableQuery = ({ pageSize = DEFAULT_PAGE_SIZE }: UseSupplierTableQueryProps) => {
  const queryObject = useQueryParams([
    'offset',
    'sortBy',
    'companyName',
    'contactName',
    'email',
    'phone',
    'createdAt',
    'updatedAt',
  ]);

  const { offset, sortBy, companyName, contactName, email, phone, createdAt, updatedAt } = queryObject;

  const searchParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    sortBy: sortBy || 'createdAt:desc',
    company_name: companyName,
    contact_name: contactName,
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
