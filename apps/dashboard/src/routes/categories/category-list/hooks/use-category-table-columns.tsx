import { ICategory } from '@shared';
import { createColumnHelper } from '@tanstack/react-table';

import { DateCell } from '@/components/table/table-cells/common/date-cell';
import { SortedHeader } from '@/components/table/table-cells/common/sorted-header';
import { TextCell, TextHeader } from '@/components/table/table-cells/common/text-cell';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

import { CategoryActions } from '../components/tables/use-category-table-actions';

const columnHelper = createColumnHelper<ICategory>();

export const useCategoryTableColumns = () => {
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
    columnHelper.accessor('description', {
      header: () => <TextHeader text="Description" />,
      cell: ({ getValue }) => <TextCell text={getValue()} />,
      enableSorting: false,
      meta: {
        className: 'hidden md:table-cell',
      },
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
    columnHelper.accessor('createdAt', {
      header: () => <TextHeader text="Created" />,
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
      enableHiding: false,
      header: () => <div className="w-0"></div>,
      cell: ({ row }) => {
        const category = row.original;
        return <CategoryActions category={category} />;
      },
    }),
  ];
};
