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
    columnHelper.accessor('orderNumber', {
      header: ({ column }) => <SortedHeader text="Purchase #" column={column} />,
      cell: ({ row }) => <TextCell text={row.getValue('orderNumber')} />,
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
    columnHelper.accessor((row) => ({ received: row.receivedQuantity, total: row.totalQuantity }), {
      id: 'quantity',
      header: () => <TextHeader text="Received / Total" />,
      cell: ({ getValue }) => {
        const { received = 0, total = 0 } = getValue();
        const ratio = `${received}/${total}`;
        const percentage = total ? Math.round((received / total) * 100) : 0;

        return (
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all" style={{ width: `${percentage}%` }} />
            </div>
            <span className="w-20 truncate">{ratio}</span>
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
