import { IPurchase } from '@shared';
import { createColumnHelper } from '@tanstack/react-table';

import { DateCell } from '@/components/table/table-cells/common/date-cell';
import { MoneyAmountCell } from '@/components/table/table-cells/common/money-amount-cell';
import { SortedHeader } from '@/components/table/table-cells/common/sorted-header';
import { TextCell, TextHeader } from '@/components/table/table-cells/common/text-cell';
import { Badge } from '@/components/ui/badge';

import { PurchaseActions } from '../components/tables/purchase-table-actions';
import { purchaseStatusConfig } from '../config/purchase-status.config';

const columnHelper = createColumnHelper<IPurchase>();

export const usePurchaseTableColumns = () => {
  return [
    columnHelper.accessor('id', {
      header: ({ column }) => <SortedHeader text="Purchase #" column={column} />,
      cell: ({ row }) => <TextCell text={row.getValue('id')} />,
    }),
    columnHelper.accessor('status', {
      header: () => <TextHeader text="Status" />,
      cell: ({ getValue }) => {
        const status = getValue();
        const [color, text] = purchaseStatusConfig[status] || ['zinc', 'Unknown'];

        return (
          <div className="flex items-center space-x-2">
            <Badge color={color}>{text}</Badge>
          </div>
        );
      },
    }),
    columnHelper.accessor('totalAmount', {
      header: () => <TextHeader text="Total" align="right" />,
      cell: ({ row }) => <MoneyAmountCell currencyCode="PKR" amount={row.getValue('totalAmount')} align="right" />,
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
      cell: ({ row }) => <PurchaseActions purchase={row.original} />,
    }),
  ];
};
