import { keepPreviousData } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { useOrders } from '@/hooks/api/order.hooks';
import { useToggleState } from '@/hooks/use-toggle-state';

import { CreateOrderDialog } from './components/dialogs/create-order.dialog';
import { OrderListTable } from './components/tables/order-list-table';
import { useOrderTableQuery } from './hooks/use-order-table-query';

export const OrderList: React.FC = () => {
  const { searchParams, raw } = useOrderTableQuery({});
  const [createOpen, showCreateModal, closeCreateModal] = useToggleState();

  const {
    results = [],
    isLoading,
    isError,
    error,
    count = 0,
  } = useOrders(searchParams, {
    placeholderData: keepPreviousData,
  });

  const hasFiltersEnabled = Object.values(raw).some((value) => Boolean(value));

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Heading>Orders</Heading>
        <Button color="blue" onClick={showCreateModal}>
          Create Order
        </Button>
      </div>

      <OrderListTable
        count={count}
        error={error}
        results={results}
        isError={isError}
        isLoading={isLoading}
        hasResults={hasFiltersEnabled}
      />

      <CreateOrderDialog isOpen={createOpen} onClose={closeCreateModal} />
    </>
  );
};
