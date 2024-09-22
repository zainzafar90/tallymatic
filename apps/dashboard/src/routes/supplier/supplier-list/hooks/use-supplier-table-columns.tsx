import { ISupplier } from '@shared';
import { createColumnHelper } from '@tanstack/react-table';

import { SortedHeader } from '@/components/table/table-cells/common/sorted-header';
import { TextCell, TextHeader } from '@/components/table/table-cells/common/text-cell';
import { Checkbox } from '@/components/ui/checkbox';

import { SupplierActions } from '../components/tables/supplier-table-actions';

const columnHelper = createColumnHelper<ISupplier>();

export const useSupplierTableColumns = () => {
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
    columnHelper.accessor('companyName', {
      header: ({ column }) => <SortedHeader text="Company Name" column={column} />,
      cell: ({ row }) => <TextCell text={row.getValue('companyName')} />,
      enableHiding: false,
    }),
    columnHelper.accessor('contactName', {
      header: () => <TextHeader text="Contact Name" />,
      cell: ({ getValue }) => <TextCell text={getValue()} />,
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
        const supplier = row.original;
        return <SupplierActions supplier={supplier} />;
      },
    }),
  ];
};
