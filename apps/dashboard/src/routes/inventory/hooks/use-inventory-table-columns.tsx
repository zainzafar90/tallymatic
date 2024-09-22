import { IProductVariant } from '@shared';
import { createColumnHelper } from '@tanstack/react-table';

import { SortedHeader } from '@/components/table/table-cells/common/sorted-header';
import { StockStatus } from '@/components/table/table-cells/common/stock-status-cell';
import { TextCell, TextHeader } from '@/components/table/table-cells/common/text-cell';

import { InventoryActions } from '../components/tables/inventory-table-actions';

const columnHelper = createColumnHelper<IProductVariant>();

export const useInventoryTableColumns = () => {
  return [
    columnHelper.accessor('name', {
      header: ({ column }) => <SortedHeader text="Name" column={column} />,
      cell: ({ row }) => (
        <div className="flex flex-col h-full w-full gap-x-3 overflow-hidden">
          <div className="truncate">{row.original.product?.name}</div>
          <div className="text-sm text-gray-500">{row.getValue('name')}</div>
        </div>
      ),
      enableHiding: false,
    }),
    columnHelper.accessor('sku', {
      header: () => <TextHeader text="SKU" />,
      cell: ({ row }) => <TextCell text={row.getValue('sku')} />,
      enableHiding: false,
    }),
    columnHelper.accessor('stock', {
      header: ({ column }) => <SortedHeader text="Stock" column={column} />,
      cell: ({ row }) => <TextCell text={row.getValue('stock')} />,
      enableHiding: false,
    }),
    columnHelper.accessor('lowStockThreshold', {
      header: () => <TextHeader text="Low Stock Threshold" />,
      cell: ({ row }) => <TextCell text={row.getValue('lowStockThreshold')} />,
      enableHiding: false,
    }),
    columnHelper.accessor('stock', {
      header: ({ column }) => <SortedHeader text="Status" column={column} />,
      cell: ({ row }) => {
        const stock = row.getValue<number>('stock');
        const lowStockThreshold = row.getValue<number>('lowStockThreshold') || 0;
        return <StockStatus stock={stock} lowStockThreshold={lowStockThreshold} />;
      },
      enableSorting: false,
    }),
    columnHelper.display({
      id: 'actions',
      enableHiding: false,
      header: () => <div className="w-0"></div>,
      cell: ({ row }) => {
        const variant = row.original;
        return <InventoryActions variant={variant} />;
      },
    }),
  ];
};
