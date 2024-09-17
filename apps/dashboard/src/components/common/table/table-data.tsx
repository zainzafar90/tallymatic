import { toast } from 'sonner';
import { flexRender, Table as TanstackTable } from '@tanstack/react-table';

import { usePrompt } from '@/components/common/use-prompt';
import { CommandBar } from '@/components/ui/command-bar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { NoResults } from '@/routes/products/product-list/components/no-results';
import { cn } from '@/utils/cn';

type ColumnMeta = {
  className?: string;
};

type DataWithId = {
  id: string;
};

interface TableDataProps<TData> {
  table: TanstackTable<TData>;
  onClearFilters?: () => void;
  onBulkDelete?: (selectedIds: string[]) => Promise<void>;
}

export function TableData<TData>({ table, onClearFilters, onBulkDelete }: TableDataProps<TData>) {
  const { prompt, PromptDialog } = usePrompt();

  const selectedRows = table.getSelectedRowModel().rows;
  const selectedIds = selectedRows.map((row) => (row.original as TData & DataWithId).id);

  const handleBulkDelete = async () => {
    const confirmed = await prompt({
      title: 'Are you sure?',
      description: ` You are about to delete ${selectedRows.length} item(s)`,
      warning: 'This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      destructive: true,
    });

    if (!confirmed) {
      return;
    }

    try {
      await onBulkDelete?.(selectedIds);
      toast.success(`${selectedRows.length} item(s) deleted successfully`);
      table.resetRowSelection();
    } catch (error) {
      toast.error('Failed to delete items', {
        description: 'There was an error while deleting the items. Please try again.',
        closeButton: true,
      });
    }
  };

  return (
    <Table bleed className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
      <TableHead>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHeader key={header.id} className={cn((header.column.columnDef.meta as ColumnMeta)?.className)}>
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
                <TableCell key={cell.id} className={cn((cell.column.columnDef.meta as ColumnMeta)?.className)}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
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

      <CommandBar open={table.getSelectedRowModel().rows.length > 0}>
        <CommandBar.Bar>
          <CommandBar.Value>{table.getSelectedRowModel().rows.length} selected</CommandBar.Value>
          <CommandBar.Seperator />
          <CommandBar.Command action={handleBulkDelete} label="Delete" shortcut="d" />
        </CommandBar.Bar>
      </CommandBar>

      <PromptDialog />
    </Table>
  );
}
