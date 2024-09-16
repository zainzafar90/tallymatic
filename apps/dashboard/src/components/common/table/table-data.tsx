import { Fragment } from 'react';

import { toast } from 'sonner';
import { flexRender, Table as TanstackTable } from '@tanstack/react-table';

import { usePrompt } from '@/components/common/use-prompt';
import { CommandBar } from '@/components/ui/command-bar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { NoResults } from '@/routes/products/product-list/components/no-results';
import { cn } from '@/utils/cn';

interface TableDataProps<TData> {
  table: TanstackTable<TData>;
  onClearFilters?: () => void;
  onBulkDelete?: (selectedIds: string[]) => Promise<void>;
}

export function TableData<TData>({ table, onClearFilters, onBulkDelete }: TableDataProps<TData>) {
  const { prompt, PromptDialog } = usePrompt();

  const handleBulkDelete = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedIds = selectedRows.map((row: any) => row.original.id);
    const selectedNames = selectedRows.map((row: any) => row.original.name || 'Untitled');

    const namesList = selectedNames.map((name) => `• ${name}`).join('\n');
    const maxNamesToShow = 5;
    const truncatedNamesList =
      selectedNames.length > maxNamesToShow
        ? namesList.split('\n').slice(0, maxNamesToShow).join('\n') +
          `\n• ... and ${selectedNames.length - maxNamesToShow} more`
        : namesList;

    const confirmed = await prompt({
      title: 'Are you sure?',
      description: (
        <Fragment>
          You are about to delete {selectedRows.length} item(s):
          <br />
          {truncatedNamesList.split('\n').map((name, index) => (
            <Fragment key={index}>
              {name}
              <br />
            </Fragment>
          ))}
          <br />
          <span className="text-destructive">This action cannot be undone.</span>
        </Fragment>
      ),
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
              <TableHeader key={header.id} className={cn((header.column.columnDef.meta as any)?.className)}>
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
                <TableCell key={cell.id} className={cn((cell.column.columnDef.meta as any)?.className)}>
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
