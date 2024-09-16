import { flexRender, Table as TanstackTable } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { NoResults } from '@/routes/products/product-list/components/no-results';

interface TableDataProps<TData> {
  table: TanstackTable<TData>;
  onClearFilters?: () => void;
}

export function TableData<TData>({ table, onClearFilters }: TableDataProps<TData>) {
  return (
    <Table bleed className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
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
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className={row.getIsSelected() ? 'bg-zinc-950/[2.5%] dark:bg-white/[2.5%]' : ''}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
              <NoResults onClearFilters={onClearFilters} />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
