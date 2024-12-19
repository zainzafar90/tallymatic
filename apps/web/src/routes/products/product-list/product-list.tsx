import { keepPreviousData } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { useProducts } from '@/hooks/api/products.hooks';
import { useToggleState } from '@/hooks/use-toggle-state';

import { CreateProductDialog } from './components/dialogs/create-product.dialog';
import { ProductListTable } from './components/tables/product-list-table';
import { useProductTableQuery } from './hooks/use-product-table-query';

export const ProductList = () => {
  const { searchParams, raw } = useProductTableQuery({});
  const [createOpen, showCreateModal, closeCreateModal] = useToggleState();

  const {
    results = [],
    isLoading,
    isError,
    error,
    count = 0,
  } = useProducts(searchParams, {
    placeholderData: keepPreviousData,
  });

  const hasFiltersEnabled = Object.values(raw).some((value) => Boolean(value));

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Heading>Products</Heading>
        <Button color="blue" onClick={() => showCreateModal()}>
          Create Product
        </Button>
      </div>

      <ProductListTable
        count={count}
        error={error}
        results={results}
        isError={isError}
        isLoading={isLoading}
        hasResults={hasFiltersEnabled}
      />

      <CreateProductDialog isOpen={createOpen} onClose={closeCreateModal} />
    </>
  );
};
