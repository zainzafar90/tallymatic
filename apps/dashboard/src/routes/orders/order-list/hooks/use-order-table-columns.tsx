import { IOrder } from '@shared';
import { createColumnHelper } from '@tanstack/react-table';

import { DateCell } from '@/components/table/table-cells/common/date-cell';
import { MoneyAmountCell } from '@/components/table/table-cells/common/money-amount-cell';
import { SortedHeader } from '@/components/table/table-cells/common/sorted-header';
import { TextCell, TextHeader } from '@/components/table/table-cells/common/text-cell';
import { Badge } from '@/components/ui/badge';

import { OrderActions } from '../components/tables/order-table-actions';
import { orderStatusConfig } from '../config/order-status.config';

const columnHelper = createColumnHelper<IOrder>();

export const useOrderTableColumns = () => {
  return [
    columnHelper.accessor('orderNumber', {
      header: ({ column }) => <SortedHeader text="Order #" column={column} />,
      cell: ({ row }) => <TextCell text={row.getValue('orderNumber')} />,
    }),
    columnHelper.accessor('status', {
      header: () => <TextHeader text="Status" />,
      cell: ({ getValue }) => {
        const status = getValue();
        const [color, text] = orderStatusConfig[status] || ['zinc', 'Unknown'];

        return (
          <div className="flex items-center space-x-2">
            <Badge color={color}>{text}</Badge>
          </div>
        );
      },
    }),
    columnHelper.accessor('total', {
      header: () => <TextHeader text="Total" align="right" />,
      cell: ({ row }) => <MoneyAmountCell currencyCode="PKR" amount={row.getValue('total')} align="right" />,
      enableHiding: false,
    }),
    columnHelper.accessor('createdAt', {
      header: ({ column }) => <SortedHeader text="Created" column={column} />,
      cell: ({ getValue }) => {
        const value = getValue();
        return value ? <DateCell date={value} /> : null;
      },
      enableSorting: false,
      meta: {
        className: 'hidden xl:table-cell',
      },
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => <OrderActions order={row.original} />,
    }),
  ];
};
