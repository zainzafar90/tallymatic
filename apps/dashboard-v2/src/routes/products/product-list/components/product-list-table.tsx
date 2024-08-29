import { ProductResponse } from '@shared';
import { keepPreviousData } from '@tanstack/react-query';
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useProducts } from '@/hooks/api/products';
import { useMe } from '@/hooks/api/users';

import { ProductListSkeleton } from './product-list-skeleton';

const PAGE_SIZE = 20;

const columns: ColumnDef<ProductResponse>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'description',
    header: () => <div className="hidden sm:flex">Description</div>,
    cell: ({ getValue }) => <div className="truncate max-w-xs hidden sm:block">{getValue() as string}</div>,
  },
  {
    accessorKey: 'price',
    header: () => <div className="text-right">Price</div>,
    cell: ({ getValue }) => <div className="text-right">{getValue() as number}</div>,
  },
];

export const ProductListTable = () => {
  const { data } = useMe();

  const {
    results = [],
    isLoading,
    isError,
    error,
    count,
  } = useProducts(
    {
      organizationId: data?.organizationId || '',
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
