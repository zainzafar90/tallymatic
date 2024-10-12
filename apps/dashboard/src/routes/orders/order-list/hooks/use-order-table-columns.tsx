import { IOrder, OrderStatus } from '@shared';
import { createColumnHelper } from '@tanstack/react-table';

import { DateCell } from '@/components/table/table-cells/common/date-cell';
import { MoneyAmountCell } from '@/components/table/table-cells/common/money-amount-cell';
import { SortedHeader } from '@/components/table/table-cells/common/sorted-header';
import { TextCell, TextHeader } from '@/components/table/table-cells/common/text-cell';
import { Badge } from '@/components/ui/badge';
import { Color } from '@/components/ui/utils';
import { cn } from '@/utils/cn';

import { OrderActions } from '../components/tables/order-table-actions';

const columnHelper = createColumnHelper<IOrder>();

export const useOrderTableColumns = () => {
  return [
    columnHelper.accessor('number', {
      header: ({ column }) => <SortedHeader text="Order #" column={column} />,
      cell: ({ row }) => <TextCell text={row.getValue('number')} />,
    }),
    columnHelper.accessor('status', {
      header: () => <TextHeader text="Status" />,

      cell: ({ getValue }) => {
        const status = getValue();

        const statusConfig: Record<OrderStatus, [Color, string]> = {
          [OrderStatus.PENDING]: ['yellow', 'Pending'],
          [OrderStatus.PAID]: ['green', 'Paid'],
          [OrderStatus.UNPAID]: ['red', 'Unpaid'],
          [OrderStatus.PARTIALLY_PAID]: ['orange', 'Partially Paid'],
          [OrderStatus.REFUNDED]: ['blue', 'Refunded'],
          [OrderStatus.VOIDED]: ['zinc', 'Voided'],
        };

        const [color, text] = statusConfig[status] || ['zinc', 'Unknown'];

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
