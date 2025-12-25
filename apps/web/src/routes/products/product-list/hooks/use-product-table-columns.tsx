import { IProductVariant, ProductResponse } from '@repo/shared';
import { createColumnHelper } from '@tanstack/react-table';

import { LetterBox } from '@/components/common/letter-box/letter-box';
import { DateCell } from '@/components/table/table-cells/common/date-cell';
import { SortedHeader } from '@/components/table/table-cells/common/sorted-header';
import { TextCell, TextHeader } from '@/components/table/table-cells/common/text-cell';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { parseFloat } from '@/utils/number-utils';

import { ProductActions } from '../components/tables/product-table-actions';

const columnHelper = createColumnHelper<ProductResponse>();

const VariantPopover = ({ variants }: { variants: IProductVariant[] }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-left">
          {variants.length === 1 ? `${variants[0].name || 'Default'} ` : `${variants.length} variants`}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          {variants.map((variant, index) => (
            <div key={index} className="flex justify-between items-center py-1">
              <span className="text-sm">{variant.name || 'Default Variant'}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm">
                  <small>&#x20A8;</small> {parseFloat(variant.price)}
                </span>
                <span className="text-sm text-gray-500">Stock: {variant.stock}</span>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const useProductTableColumns = () => {
  return [
    columnHelper.accessor('name', {
      header: ({ column }) => <SortedHeader text="Name" column={column} />,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <LetterBox text={row.getValue('name')} />
          <div className="flex flex-col">
            <TextCell text={row.getValue('name')} />
            {row.original.variants.length > 0 ? (
              <VariantPopover variants={row.original.variants || ([] as IProductVariant[])} />
            ) : (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>
        </div>
      ),
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
        const hasPrices = prices.length > 0;
        const min = hasPrices ? Math.min(...prices) : 0;
        const max = hasPrices ? Math.max(...prices) : 0;
        const formattedPrice = min === max ? `${min}` : `${min} - ${max}`;

        return (
          <div className="text-right font-medium">
            {hasPrices ? (
              <span className="text-right">
                <small>&#x20A8;</small> {formattedPrice}
              </span>
            ) : (
              <span className="text-gray-500">&mdash;</span>
            )}
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
            {totalStock ? <Badge color="green">In stock</Badge> : <Badge color="red">Out of stock</Badge>}
          </div>
        );
      },
      enableSorting: false,
      meta: {
        className: 'hidden sm:table-cell',
      },
    }),

    columnHelper.accessor('createdAt', {
      id: 'createdAt',
      header: ({ column }) => <SortedHeader text="Created" column={column} />,
      cell: ({ getValue }) => {
        const value = getValue();

        if (!value) {
          return;
        }

        return <DateCell date={value} />;
      },
      enableSorting: true,
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
