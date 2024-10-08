import { keepPreviousData } from '@tanstack/react-query';

import { Heading } from '@/components/ui/heading';
import { useAllInventoryLevels } from '@/hooks/api/inventory.hooks';

import { InventoryTable } from './components/tables/inventory-list-table';
import { useInventoryTableQuery } from './hooks/use-inventory-table-query';

export const InventoryList = () => {
  const { searchParams, raw } = useInventoryTableQuery({});

  const {
    results = [],
    isLoading,
    isError,
    error,
    count = 0,
  } = useAllInventoryLevels(searchParams, {
    placeholderData: keepPreviousData,
  });

  const hasFiltersEnabled = Object.values(raw).some((value) => Boolean(value));

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <Heading>Inventory Management</Heading>
      </div>

      <InventoryTable
        count={count}
        error={error}
        results={results}
        isError={isError}
        isLoading={isLoading}
        hasResults={hasFiltersEnabled}
      />
    </div>
  );
};
