import { keepPreviousData } from '@tanstack/react-query';

import { Heading } from '@/components/ui/heading';
import { useProducts } from '@/hooks/api/products.hooks';

import { CreateProductDialog } from './components/create-product.dialog';
import { ProductListTable } from './components/product-list-table';
import { useProductTableQuery } from './hooks/use-product-table-query';

export const ProductList = () => {
  const { searchParams } = useProductTableQuery({});

  const {
    results = [],
    isLoading,
    isError,
    error,
    count = 0,
  } = useProducts(searchParams, {
    placeholderData: keepPreviousData,
  });

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <Heading>Products</Heading>
        <CreateProductDialog outline amount="80">
          Create Product
        </CreateProductDialog>
      </div>
      <ProductListTable results={results} count={count} isLoading={isLoading} isError={isError} error={error} />
    </div>
  );
};
