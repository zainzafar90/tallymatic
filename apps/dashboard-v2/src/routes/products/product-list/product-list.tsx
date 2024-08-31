import { keepPreviousData } from '@tanstack/react-query';

import { Heading } from '@/components/ui/heading';
import { useProducts } from '@/hooks/api/products';

import { CreateProductDialog } from './components/create-product.dialog';
import { DataTableDemo } from './components/demo';
import { ProductListTable } from './components/product-list-table';

const PAGE_SIZE = 10;

export const ProductList = () => {
  const {
    results = [],
    isLoading,
    isError,
    error,
    count,
  } = useProducts(
    {
      offset: 0,
      limit: PAGE_SIZE,
    },
    {
      placeholderData: keepPreviousData,
    }
  );

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <Heading>Products</Heading>
        <CreateProductDialog outline amount="80">
          Create Product
        </CreateProductDialog>
      </div>
      <ProductListTable />
      <DataTableDemo />
    </div>
  );
};
