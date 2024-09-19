import { keepPreviousData } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { useAllInventoryLevels } from '@/hooks/api/inventory.hooks';
import { useToggleState } from '@/hooks/use-toggle-state';

import { AdjustStockModal } from './components/adjust-stock-modal';
import { InventoryTable } from './components/inventory-list-table';
import { LowStockAlerts } from './components/low-stock-alerts';
import { useInventoryTableQuery } from './hooks/use-inventory-table-query';

export const InventoryList = () => {
  const { searchParams, raw } = useInventoryTableQuery({});
  const [adjustStockOpen, showAdjustStock, closeAdjustStock] = useToggleState();

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
    <>
      <div className="flex items-end justify-between gap-4">
        <Heading>Inventory Management</Heading>
        <Button color="blue" onClick={showAdjustStock}>
          Adjust Stock
        </Button>
      </div>

      <InventoryTable
        count={count}
        error={error}
        results={results}
        isError={isError}
        isLoading={isLoading}
        hasResults={hasFiltersEnabled}
      />
      <LowStockAlerts />

      <AdjustStockModal isOpen={adjustStockOpen} onClose={closeAdjustStock} />
    </>
  );
};
