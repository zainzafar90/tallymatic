import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { ProductResponse } from '@shared';
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/ui/dropdown';

export const columns: ColumnDef<ProductResponse>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        className="w-6 h-6"
        checked={table.getIsAllPageRowsSelected()}
        onChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="w-6"
        checked={row.getIsSelected()}
        onChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <button className="flex items-center space-x-2" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <button className="table-cell w-full" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <div className="flex items-center justify-end space-x-2">
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        </button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(price);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  // {
  //   accessorKey: 'stock',
  //   header: 'Stock',
  //   cell: ({ row }) => <div>{row.getValue('stock')}</div>,
  // },
  {
    id: 'actions',
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="text-right">
          <Dropdown>
            <DropdownButton outline aria-label="More Options" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-6 w-6" />
            </DropdownButton>
            <DropdownMenu anchor="top end">
              <DropdownItem onClick={() => console.log('Edit', product.id)}>
                <DropdownLabel>Edit</DropdownLabel>
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem onClick={() => console.log('Delete', product.id)}>
                <DropdownLabel>Delete</DropdownLabel>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
    },
  },
];
