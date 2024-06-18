import { useMemo } from 'react';

import { Product } from '@medusajs/medusa';
import { createColumnHelper } from '@tanstack/react-table';

import { CollectionCell, CollectionHeader } from '@/components/table/table-cells/product/collection-cell';
import { ProductCell, ProductHeader } from '@/components/table/table-cells/product/product-cell';
import { ProductStatusCell, ProductStatusHeader } from '@/components/table/table-cells/product/product-status-cell';
import { VariantCell, VariantHeader } from '@/components/table/table-cells/product/variant-cell';

const columnHelper = createColumnHelper<Product>();

export const useProductTableColumns = () => {
  return useMemo(
    () => [
      columnHelper.display({
        id: 'product',
        header: () => <ProductHeader />,
        cell: ({ row }) => <ProductCell product={row.original} />,
      }),
      columnHelper.accessor('collection', {
        header: () => <CollectionHeader />,
        cell: ({ row }) => <CollectionCell collection={row.original.collection} />,
      }),
      columnHelper.accessor('variants', {
        header: () => <VariantHeader />,
        cell: ({ row }) => <VariantCell variants={row.original.variants} />,
      }),
      columnHelper.accessor('status', {
        header: () => <ProductStatusHeader />,
        cell: ({ row }) => <ProductStatusCell status={row.original.status} />,
      }),
    ],
    []
  );
};
