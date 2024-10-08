import { FinancialStatus, IOrder } from '@shared';
import { createColumnHelper } from '@tanstack/react-table';

import { DateCell } from '@/components/table/table-cells/common/date-cell';
import { MoneyAmountCell } from '@/components/table/table-cells/common/money-amount-cell';
import { SortedHeader } from '@/components/table/table-cells/common/sorted-header';
import { TextCell, TextHeader } from '@/components/table/table-cells/common/text-cell';
import { Badge } from '@/components/ui/badge';
import { Color } from '@/components/ui/utils';

import { OrderActions } from '../components/tables/order-table-actions';

const columnHelper = createColumnHelper<IOrder>();

export const useOrderTableColumns = () => {
  return [
    columnHelper.accessor('number', {
      header: ({ column }) => <SortedHeader text="Order #" column={column} />,
      cell: ({ row }) => <TextCell text={row.getValue('number')} />,
    }),
    columnHelper.accessor('financialStatus', {
      header: () => <TextHeader text="Financial Status" />,

      cell: ({ getValue }) => {
        const status = getValue();

        const financialStatusConfig: Record<FinancialStatus, [Color, string]> = {
          [FinancialStatus.PENDING]: ['yellow', 'Pending'],
          [FinancialStatus.PAID]: ['green', 'Paid'],
          [FinancialStatus.UNPAID]: ['red', 'Unpaid'],
          [FinancialStatus.PARTIALLY_PAID]: ['orange', 'Partially Paid'],
          [FinancialStatus.REFUNDED]: ['blue', 'Refunded'],
          [FinancialStatus.VOIDED]: ['zinc', 'Voided'],
        };

        const [color, text] = financialStatusConfig[status] || ['zinc', 'Unknown'];

        return (
          <div className="flex items-center space-x-2">
            <Badge color={color}>{text}</Badge>
          </div>
        );
      },
    }),
    columnHelper.accessor('fulfillmentStatus', {
      header: () => <TextHeader text="Fulfillment Status" />,
      cell: ({ getValue }) => <TextCell text={getValue()} />,
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
