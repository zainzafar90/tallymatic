import { keepPreviousData } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { useSuppliers } from '@/hooks/api/supplier.hooks';
import { useToggleState } from '@/hooks/use-toggle-state';

import { CreateSupplierDialog } from './components/dialogs/create-supplier.dialog';
import { SupplierListTable } from './components/tables/supplier-list-table';
import { useSupplierTableQuery } from './hooks/use-supplier-table-query';

export const SupplierList = () => {
  const { searchParams, raw } = useSupplierTableQuery({});
  const [createOpen, showCreateModal, closeCreateModal] = useToggleState();

  const {
    results = [],
    isLoading,
    isError,
    error,
    count = 0,
  } = useSuppliers(searchParams, {
    placeholderData: keepPreviousData,
  });

  const hasFiltersEnabled = Object.values(raw).some((value) => Boolean(value));

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Heading>Suppliers</Heading>
        <Button color="blue" onClick={() => showCreateModal()}>
          Create Supplier
        </Button>
      </div>

      <SupplierListTable
        count={count}
        error={error}
        results={results}
        isError={isError}
        isLoading={isLoading}
        hasResults={hasFiltersEnabled}
      />

      <CreateSupplierDialog isOpen={createOpen} onClose={closeCreateModal} />
    </>
  );
};
