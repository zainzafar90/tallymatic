import { keepPreviousData } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { useCustomers } from '@/hooks/api/customer.hooks';
import { useToggleState } from '@/hooks/use-toggle-state';

import { CreateCustomerDialog } from './components/dialog/create-customer.dialog';
import { CustomerListTable } from './components/tables/customer-list-table';
import { useCustomerTableQuery } from './hooks/use-customer-table-query';

export const CustomerList = () => {
  const { searchParams, raw } = useCustomerTableQuery({});
  const [createOpen, showCreateModal, closeCreateModal] = useToggleState();

  const {
    results = [],
    isLoading,
    isError,
    error,
    count = 0,
  } = useCustomers(searchParams, {
    placeholderData: keepPreviousData,
  });

  const hasFiltersEnabled = Object.values(raw).some((value) => Boolean(value));

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Heading>Customers</Heading>
        <Button color="blue" onClick={() => showCreateModal()}>
          Create Customer
        </Button>
      </div>

      <CustomerListTable
        count={count}
        error={error}
        results={results}
        isError={isError}
        isLoading={isLoading}
        hasResults={hasFiltersEnabled}
      />

      <CreateCustomerDialog isOpen={createOpen} onClose={closeCreateModal} />
    </>
  );
};
