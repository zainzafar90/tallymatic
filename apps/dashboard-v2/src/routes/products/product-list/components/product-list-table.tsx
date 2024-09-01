import { IProduct } from '@shared';

import { TableData } from '@/components/common/table/table-data';
import { TableListSkeleton } from '@/components/common/table/table-list-selecton';
import { DataTablePagination } from '@/components/common/table/table-pagination';
import { ToggleColumns } from '@/components/common/table/toggle-columns';
import { useDataTable } from '@/components/common/table/use-table-data';
import { Input } from '@/components/ui/input';
import { FetchError } from '@/lib/is-fetch-error';

import { useProductTableColumns } from '../hooks/use-product-table-columns';

type ProductListTableProps = {
  results: IProduct[];
  count: number;
  isLoading: boolean;
  isError: boolean;
  error: FetchError | null;
};

export const ProductListTable = (props: ProductListTableProps) => {
  const columns = useProductTableColumns();

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

  if (props.isError) {
    throw props.error;
  }

  if (props.isLoading) {
    return <TableListSkeleton />;
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 py-4">
        <Input
          placeholder="Filter products..."
          value={table.getState().globalFilter ?? ''}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />

        <ToggleColumns table={table} />
      </div>

      <TableData table={table} />
      <DataTablePagination table={table} />
    </div>
  );
};
