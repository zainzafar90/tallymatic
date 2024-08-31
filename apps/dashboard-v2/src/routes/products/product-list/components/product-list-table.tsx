import { keepPreviousData } from '@tanstack/react-query';
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useProducts } from '@/hooks/api/products';

import { columns } from './product-list-columns';
import { ProductListSkeleton } from './product-list-skeleton';

const PAGE_SIZE = 10;

export const ProductListTable = () => {
  const {
    results = [],
    isLoading,
    isError,
    error,
    count,
  } = useProducts(
    {
      offset: 0,
      limit: PAGE_SIZE,
    },
    {
      placeholderData: keepPreviousData,
    }
  );

  const table = useReactTable({
    data: results,
    columns,
    rowCount: count,
    manualPagination: true,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: PAGE_SIZE,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isError) {
    throw error;
  }

  if (isLoading) {
    return <ProductListSkeleton />;
  }

  return (
    <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
      <TableHead>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHeader key={header.id}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHeader>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
