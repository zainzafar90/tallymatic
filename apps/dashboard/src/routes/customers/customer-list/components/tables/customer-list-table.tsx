import { useNavigate } from 'react-router-dom';

import { toast } from 'sonner';
import { ICustomer } from '@shared';

import { TableData } from '@/components/common/table/table-data';
import { TableListSkeleton } from '@/components/common/table/table-list-selecton';
import { NoRecords } from '@/components/common/table/table-no-records';
import { DataTablePagination } from '@/components/common/table/table-pagination';
import { ToggleColumns } from '@/components/common/table/toggle-columns';
import { useDataTable } from '@/components/common/table/use-table-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBulkDeleteCustomers } from '@/hooks/api/customer.hooks';
import { FetchError } from '@/lib/is-fetch-error';

import { useCustomerTableColumns } from '../../hooks/use-customer-table-columns';

type CustomerListTableProps = {
  results: ICustomer[];
  count: number;
  hasResults: boolean;
  isLoading: boolean;
  isError: boolean;
  error: FetchError | null;
};

export const CustomerListTable = (props: CustomerListTableProps) => {
  const navigate = useNavigate();
  const columns = useCustomerTableColumns();
  const { mutateAsync } = useBulkDeleteCustomers();

  const table = useDataTable({
    columns,
    data: props.results || [],
    rowCount: props.count,
    enableSorting: true,
    enableFiltering: true,
    enablePagination: true,
    enableRowSelection: true,
    globalFilterField: 'name',
  });

  const onClearFilters = () => {
    navigate('/customers');
  };

  const handleBulkDelete = async (selectedIds: string[]) => {
    try {
      await mutateAsync(selectedIds);
    } catch (error) {
      toast.error('Failed to delete customers', {
        description: 'There was an error while deleting the customers. Please try again.',
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
    return <NoRecords title="You have no customers" description="You can start adding customers" />;
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 py-4">
        <Input
          placeholder="Filter customers..."
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
