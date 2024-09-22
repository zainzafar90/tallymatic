import { ICustomer } from '@shared';
import { createColumnHelper } from '@tanstack/react-table';

import { SortedHeader } from '@/components/table/table-cells/common/sorted-header';
import { TextCell, TextHeader } from '@/components/table/table-cells/common/text-cell';
import { Checkbox } from '@/components/ui/checkbox';

import { CustomerActions } from '../components/tables/customer-table-actions';

const columnHelper = createColumnHelper<ICustomer>();

export const useCustomerTableColumns = () => {
  return [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox checked={row.getIsSelected()} onChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
      ),
      enableSorting: false,
      enableHiding: false,
    }),
    columnHelper.accessor('name', {
      header: ({ column }) => <SortedHeader text="Name" column={column} />,
      cell: ({ row }) => <TextCell text={row.getValue('name')} />,
      enableHiding: false,
    }),
    columnHelper.accessor('email', {
      header: () => <TextHeader text="Email" />,
      cell: ({ getValue }) => <TextCell text={getValue()} />,
    }),
    columnHelper.accessor('phone', {
      header: () => <TextHeader text="Phone" />,
      cell: ({ getValue }) => <TextCell text={getValue()} />,
    }),
    columnHelper.accessor('address', {
      header: () => <TextHeader text="Address" />,
      cell: ({ getValue }) => <TextCell text={getValue()} />,
    }),
    columnHelper.display({
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const customer = row.original;
        return <CustomerActions customer={customer} />;
      },
    }),
  ];
};
