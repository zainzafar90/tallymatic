import { ICategory, ProductResponse } from '@shared';
import { createColumnHelper } from '@tanstack/react-table';

import { DateCell } from '@/components/table/table-cells/common/date-cell';
import { SortedHeader } from '@/components/table/table-cells/common/sorted-header';
import { TextCell, TextHeader } from '@/components/table/table-cells/common/text-cell';
import { VariantCell } from '@/components/table/table-cells/product/variant-cell';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { parseFloat } from '@/utils/number-utils';

import { ProductActions } from '../components/use-product-table-actions';

const columnHelper = createColumnHelper<ProductResponse & { category: ICategory }>();

export const useProductTableColumns = () => {
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
    columnHelper.accessor((row) => row.category, {
      id: 'category',
      header: () => <TextHeader text="Category" />,
      cell: ({ getValue }) => {
        const value = getValue();
        return <TextCell text={value?.name} />;
      },
      enableSorting: false,
      meta: {
        className: 'hidden sm:table-cell',
      },
    }),
    columnHelper.accessor((row) => row.variants.map((v) => parseFloat(v.price)), {
      id: 'price',
      header: () => <TextHeader text="Price" align="right" />,
      cell: ({ getValue }) => {
        const prices = getValue();
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const formattedPrice = min === max ? `${min}` : `${min} - ${max}`;
        return (
          <div className="text-right font-medium">
            <small>&#x20A8;</small> {formattedPrice}
          </div>
        );
      },
      enableSorting: false,
    }),
    columnHelper.accessor((row) => row.variants.map((v) => v.stock), {
      id: 'stock',
      header: () => <TextHeader text="Stock" />,
      cell: ({ getValue }) => {
        const stocks = getValue();
        const totalStock = stocks.reduce((acc, stock) => acc + stock, 0);
        return (
          <div className="flex items-center space-x-2">
            {totalStock ? <Badge color="zinc">In stock</Badge> : <Badge color="red">Out of stock</Badge>}
          </div>
        );
      },
      enableSorting: false,
      meta: {
        className: 'hidden sm:table-cell',
      },
    }),
    columnHelper.accessor('variants', {
      id: 'variants',
      header: () => <TextHeader text="Variants" align="right" />,
      cell: ({ row }) => {
        return <VariantCell variants={row.getValue('variants')} />;
      },
      enableSorting: false,
      meta: {
        className: 'hidden md:table-cell',
      },
    }),
    columnHelper.accessor('createdAt', {
      id: 'createdAt',
      header: () => <TextHeader text="Created" />,
      cell: ({ getValue }) => {
        const value = getValue();

        if (!value) {
          return;
        }

        return <DateCell date={value} />;
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
        const product = row.original;
        return <ProductActions product={product} />;
      },
    }),
  ];
};
