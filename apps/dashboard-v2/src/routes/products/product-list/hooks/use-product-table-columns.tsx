import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { ProductResponse } from '@shared';
import { createColumnHelper } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { parseFloat } from '@/utils/number-utils';

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
    columnHelper.accessor((row) => row.category, {
      id: 'category',
      header: 'Category',
      cell: ({ getValue }) => <div>{getValue()?.name || '-'}</div>,
    }),
    columnHelper.accessor((row) => row.variants.map((v) => parseFloat(v.price)), {
      id: 'price',
      header: () => {
        return <div className="flex items-center justify-end space-x-2">Price</div>;
      },
      cell: ({ getValue }) => {
        const prices = getValue();
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const formattedPrice = min === max ? `${min}` : `${min} - ${max}`;
        return (
          <div className="text-right font-medium">
            <small>&#x20A8;</small> {formattedPrice}
          </div>
        );
      },
    }),
    columnHelper.accessor((row) => row.variants.map((v) => parseFloat(v.costPrice)), {
      id: 'costPrice',
      header: () => {
        return <div className="flex items-center justify-end space-x-2">Cost</div>;
      },
      cell: ({ getValue }) => {
        const prices = getValue();
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const formattedPrice = min === max ? `${min}` : `${min} - ${max}`;
        return (
          <div className="text-right font-medium">
            <small>&#x20A8;</small> {formattedPrice}
          </div>
        );
      },
    }),
    columnHelper.accessor((row) => row.variants.map((v) => v.stock), {
      id: 'stock',
      header: () => {
        return <div className="flex items-center space-x-2">Stock</div>;
      },
      cell: ({ getValue }) => {
        const stocks = getValue();
        const totalStock = stocks.reduce((acc, stock) => acc + stock, 0);
        return (
          <div className="flex items-center space-x-2">
            {totalStock ? <Badge color="lime">In stock</Badge> : <Badge color="red">Out of stock</Badge>}
          </div>
        );
      },
    }),
    columnHelper.accessor((row) => row.variants.map((v) => v.stock), {
      id: 'stock',
      header: () => {
        return <div className="flex items-center space-x-2">Stock</div>;
      },
      cell: ({ getValue }) => {
        const stocks = getValue();
        const totalStock = stocks.reduce((acc, stock) => acc + stock, 0);
        return <div className="flex items-center space-x-2">{totalStock === 0 ? '' : totalStock}</div>;
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
