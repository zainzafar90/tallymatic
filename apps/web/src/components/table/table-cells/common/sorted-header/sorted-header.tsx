import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { Column } from '@tanstack/react-table';

type HeaderProps<T> = {
  text: string;
  column: Column<T>;
};

export const SortedHeader = <T,>({ text, column }: HeaderProps<T>) => {
  return (
    <button
      className="flex items-center space-x-2"
      onClick={() => {
        if (column.getNextSortingOrder() === 'asc') {
          column.toggleSorting(false);
        } else if (column.getNextSortingOrder() === 'desc') {
          column.toggleSorting(true);
        } else {
          column.clearSorting();
        }
      }}
    >
      {text}
      {column.getIsSorted() === 'asc' ? (
        <ArrowDown className="ml-2 h-4 w-4" />
      ) : column.getIsSorted() === 'desc' ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      )}
    </button>
  );
};
