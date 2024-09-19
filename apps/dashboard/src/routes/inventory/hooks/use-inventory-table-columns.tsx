import { IProductVariant } from '@shared';
import { createColumnHelper } from '@tanstack/react-table';

import { SortedHeader } from '@/components/table/table-cells/common/sorted-header';
import { TextCell, TextHeader } from '@/components/table/table-cells/common/text-cell';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

const columnHelper = createColumnHelper<IProductVariant>();

export const useInventoryTableColumns = () => {
  return [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          className="w-0"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
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
      meta: {
        className: 'hidden sm:table-cell',
      },
    }),
    columnHelper.accessor('name', {
      header: ({ column }) => <SortedHeader text="Name" column={column} />,
      cell: ({ row }) => <TextCell text={row.getValue('name')} />,
      enableHiding: false,
    }),
    columnHelper.accessor('stock', {
      header: () => <TextHeader text="Current Stock" />,
      cell: ({ row }) => <TextCell text={row.getValue('stock')} />,
      enableHiding: false,
    }),
    columnHelper.accessor('lowStockThreshold', {
      header: () => <TextHeader text="Low Stock Threshold" />,
      cell: ({ row }) => <TextCell text={row.getValue('lowStockThreshold')} />,
      enableHiding: false,
    }),
    columnHelper.accessor('reorderPoint', {
      header: () => <TextHeader text="Reorder Point" />,
      cell: ({ row }) => <TextCell text={row.getValue('reorderPoint')} />,
      enableHiding: false,
    }),
    columnHelper.accessor('reorderQuantity', {
      header: () => <TextHeader text="Reorder Quantity" />,
      cell: ({ row }) => <TextCell text={row.getValue('reorderQuantity')} />,
      enableHiding: false,
    }),
    columnHelper.accessor('status', {
      header: () => <TextHeader text="Status" />,
      cell: ({ getValue }) => {
        const status = getValue();
        return (
          <div className="flex items-center space-x-2">
            <Badge color={status === 'active' ? 'lime' : 'red'}>{status}</Badge>
          </div>
        );
      },
      enableSorting: false,
    }),
  ];
};
