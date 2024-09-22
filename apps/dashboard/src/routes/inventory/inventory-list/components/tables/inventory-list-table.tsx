import { useNavigate } from 'react-router-dom';

import { IProductVariant } from '@shared';

import { TableData } from '@/components/common/table/table-data';
import { TableListSkeleton } from '@/components/common/table/table-list-selecton';
import { NoRecords } from '@/components/common/table/table-no-records';
import { DataTablePagination } from '@/components/common/table/table-pagination';
import { ToggleColumns } from '@/components/common/table/toggle-columns';
import { useDataTable } from '@/components/common/table/use-table-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FetchError } from '@/lib/is-fetch-error';

import { useInventoryTableColumns } from '../../hooks/use-inventory-table-columns';

type InventoryTableProps = {
  results: IProductVariant[];
  count: number;
  hasResults: boolean;
  isLoading: boolean;
  isError: boolean;
  error: FetchError | null;
};

export const InventoryTable = (props: InventoryTableProps) => {
  const navigate = useNavigate();

  const columns = useInventoryTableColumns();

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
    navigate('/inventory');
  };

  if (props.isError) {
    throw props.error;
  }

  if (props.isLoading) {
    return <TableListSkeleton />;
  }

  if (!props.hasResults && props.results.length === 0) {
    return <NoRecords />;
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 py-4">
        <Input
          placeholder="Filter categories..."
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

      <TableData table={table} onClearFilters={onClearFilters} />
      <DataTablePagination table={table} />
    </div>
  );
};
