import { keepPreviousData } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { usePurchases } from '@/hooks/api/purchase.hooks';
import { useToggleState } from '@/hooks/use-toggle-state';

import { CreatePurchaseDialog } from './components/dialogs/create-purchase.dialog';
import { PurchaseListTable } from './components/tables/purchase-list-table';
import { usePurchaseTableQuery } from './hooks/use-purchase-table-query';

export const PurchaseList: React.FC = () => {
  const { searchParams, raw } = usePurchaseTableQuery({});
  const [isCreateDialogOpen, openCreateDialog, closeCreateDialog] = useToggleState();

  const {
    results = [],
    isLoading,
    isError,
    error,
    count = 0,
  } = usePurchases(searchParams, {
    placeholderData: keepPreviousData,
  });

  const hasFiltersEnabled = Object.values(raw).some((value) => Boolean(value));

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <Heading>Purchases</Heading>
        <Button color="blue" onClick={openCreateDialog}>
          Create Purchase
        </Button>
      </div>

      <PurchaseListTable
        count={count}
        error={error}
        results={results}
        isError={isError}
        isLoading={isLoading}
        hasResults={hasFiltersEnabled}
      />

      <CreatePurchaseDialog isOpen={isCreateDialogOpen} onClose={closeCreateDialog} />
    </div>
  );
};
