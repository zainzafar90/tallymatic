import { useQueryParams } from '@/hooks/use-query-params';

type UseSupplierTableQueryProps = {
  pageSize?: number;
};

const DEFAULT_PAGE_SIZE = 10;

export const useSupplierTableQuery = ({ pageSize = DEFAULT_PAGE_SIZE }: UseSupplierTableQueryProps) => {
  const queryObject = useQueryParams([
    'offset',
    'sortBy',
    'sortOrder',
    'companyName',
    'contactName',
    'email',
    'phone',
    'createdAt',
    'updatedAt',
  ]);

  const { offset, sortBy, sortOrder, companyName, contactName, email, phone, createdAt, updatedAt } = queryObject;

  const searchParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    sortBy: sortBy || 'createdAt',
    sortOrder: sortOrder || 'desc',
    companyName: companyName,
    contactName: contactName,
    email,
    phone,
    createdAt: createdAt ? JSON.parse(createdAt) : undefined,
    updatedAt: updatedAt ? JSON.parse(updatedAt) : undefined,
  };

  return {
    searchParams,
    raw: queryObject,
  };
};
