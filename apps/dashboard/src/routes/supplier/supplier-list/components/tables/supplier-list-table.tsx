import { useNavigate } from 'react-router-dom';

import { toast } from 'sonner';
import { ISupplier } from '@shared';

import { TableData } from '@/components/common/table/table-data';
import { TableListSkeleton } from '@/components/common/table/table-list-selecton';
import { NoRecords } from '@/components/common/table/table-no-records';
import { DataTablePagination } from '@/components/common/table/table-pagination';
import { ToggleColumns } from '@/components/common/table/toggle-columns';
import { useDataTable } from '@/components/common/table/use-table-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBulkDeleteSuppliers } from '@/hooks/api/supplier.hooks';
import { FetchError } from '@/lib/is-fetch-error';

import { useSupplierTableColumns } from '../../hooks/use-supplier-table-columns';

type SupplierListTableProps = {
  results: ISupplier[];
  count: number;
  hasResults: boolean;
  isLoading: boolean;
  isError: boolean;
  error: FetchError | null;
};

export const SupplierListTable = (props: SupplierListTableProps) => {
  const navigate = useNavigate();
  const columns = useSupplierTableColumns();
  const { mutateAsync } = useBulkDeleteSuppliers();

  const table = useDataTable({
    columns,
    data: props.results || [],
    rowCount: props.count,
    enableSorting: true,
    enableFiltering: true,
    enablePagination: true,
    enableRowSelection: true,
    globalFilterField: 'companyName',
  });

  const onClearFilters = () => {
    navigate('/suppliers');
  };

  const handleBulkDelete = async (selectedIds: string[]) => {
    try {
      await mutateAsync(selectedIds);
    } catch (error) {
      toast.error('Failed to delete suppliers', {
        description: 'There was an error while deleting the suppliers. Please try again.',
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
    return <NoRecords title="You have no suppliers" description="You can start selling as soon as you add a supplier." />;
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 py-4">
        <Input
          placeholder="Filter suppliers..."
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
