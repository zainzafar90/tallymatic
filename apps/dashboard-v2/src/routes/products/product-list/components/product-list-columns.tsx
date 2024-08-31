import { ProductResponse } from '@shared';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<ProductResponse>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'description',
    header: () => <div className="hidden sm:flex">Description</div>,
    cell: ({ getValue }) => <div className="truncate max-w-xs hidden sm:block">{getValue() as string}</div>,
  },
  {
    accessorKey: 'price',
    header: () => <div className="text-right">Price</div>,
    cell: ({ getValue }) => <div className="text-right">{getValue() as number}</div>,
  },
];
