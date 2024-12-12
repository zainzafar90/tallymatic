import { useNavigate } from 'react-router-dom';

import { toast } from 'sonner';
import { IPurchase } from '@shared';

import { TableData } from '@/components/common/table/table-data';
import { TableListSkeleton } from '@/components/common/table/table-list-selecton';
import { NoRecords } from '@/components/common/table/table-no-records';
import { DataTablePagination } from '@/components/common/table/table-pagination';
import { ToggleColumns } from '@/components/common/table/toggle-columns';
import { useDataTable } from '@/components/common/table/use-table-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBulkDeletePurchases } from '@/hooks/api/purchase.hooks';
import { FetchError } from '@/lib/is-fetch-error';

import { usePurchaseTableColumns } from '../../hooks/use-purchase-table-columns';

type PurchaseListTableProps = {
  results: IPurchase[];
  count: number;
  hasResults: boolean;
  isLoading: boolean;
  isError: boolean;
  error: FetchError | null;
};

export const PurchaseListTable = (props: PurchaseListTableProps) => {
  const navigate = useNavigate();
  const columns = usePurchaseTableColumns();
  const { mutateAsync } = useBulkDeletePurchases();

  const table = useDataTable({
    columns,
    data: props.results || [],
    rowCount: props.count,
    enableSorting: true,
    enableFiltering: true,
    enablePagination: true,
    enableRowSelection: true,
    globalFilterField: 'id',
  });

  const onClearFilters = () => {
    navigate('/purchases');
  };

  const handleBulkDelete = async (selectedIds: string[]) => {
    try {
      await mutateAsync(selectedIds);
    } catch (error) {
      toast.error('Failed to delete purchases', {
        description: 'There was an error while deleting the purchases. Please try again.',
        closeButton: true,
      });
    }
  };

  if (props.isError) {
    throw props.error;
  }

  if (props.isLoading) {
    return <TableListSkeleton />;
  }

  if (!props.hasResults && props.results.length === 0) {
    return <NoRecords title="You have no purchases" description="You can start adding purchases" />;
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 py-4">
        <Input
          placeholder="Filter purchases..."
          value={table.getState().globalFilter ?? ''}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />

        <ToggleColumns table={table} />

        {props.hasResults && (
          <Button plain onClick={onClearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      <TableData table={table} onClearFilters={onClearFilters} onBulkDelete={handleBulkDelete} />
      <DataTablePagination table={table} />
    </div>
  );
};
