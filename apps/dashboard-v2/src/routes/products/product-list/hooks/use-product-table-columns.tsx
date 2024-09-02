import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { ProductResponse } from '@shared';
import { createColumnHelper } from '@tanstack/react-table';

import { Checkbox } from '@/components/ui/checkbox';

import { ProductActions } from '../components/use-product-table-actions';

const columnHelper = createColumnHelper<ProductResponse>();

export const useProductTableColumns = () => {
  return [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          className="w-0"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="w-0"
          checked={row.getIsSelected()}
          onChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }),
    columnHelper.accessor('name', {
      header: ({ column }) => {
        return (
          <button
            className="flex items-center space-x-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            {column.getIsSorted() === 'asc' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </button>
        );
      },
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
      enableHiding: false,
    }),
    columnHelper.accessor('basePrice', {
      header: ({ column }) => {
        return (
          <button className="table-cell w-full" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            <div className="flex items-center justify-end space-x-2">
              Sale
              {column.getIsSorted() === 'asc' ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
            </div>
          </button>
        );
      },
      cell: ({ row }) => {
        const price = parseFloat(row.getValue('basePrice'));
        return (
          <div className="text-right font-medium">
            <small>&#x20A8;</small> {price}
          </div>
        );
      },
    }),
    columnHelper.accessor('costPrice', {
      header: ({ column }) => {
        return (
          <button className="table-cell w-full" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            <div className="flex items-center justify-end space-x-2">
              Cost
              {column.getIsSorted() === 'asc' ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
            </div>
          </button>
        );
      },
      cell: ({ row }) => {
        const price = parseFloat(row.getValue('costPrice'));
        return (
          <div className="text-right font-medium">
            <small>&#x20A8;</small> {price}
          </div>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      enableHiding: false,
      header: () => <div className="w-0"></div>,
      cell: ({ row }) => {
        const product = row.original;
        return <ProductActions product={product} />;
      },
    }),
  ];
};
