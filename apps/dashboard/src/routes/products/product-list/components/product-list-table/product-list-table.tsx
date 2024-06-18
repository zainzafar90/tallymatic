import { useMemo } from 'react';
import { Link, Outlet, useLoaderData } from 'react-router-dom';

import { PencilSquare, Trash } from '@medusajs/icons';
import { Product } from '@medusajs/medusa';
import { Button, Container, Heading, toast, usePrompt } from '@medusajs/ui';
import { keepPreviousData } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';

import { ActionMenu } from '@/components/common/action-menu';
import { DataTable } from '@/components/table/data-table';
import { useDeleteProduct, useProducts } from '@/hooks/api/products';
import { useProductTableFilters } from '@/hooks/table/filter/use-product-table-filters';
import { useProductTableQuery } from '@/hooks/table/query/use-product-table-query';
import { useProductTableColumns } from '@/hooks/table/use-product-table-columns';
import { useDataTable } from '@/hooks/use-data-table';

import { productsLoader } from '../../loader';

const PAGE_SIZE = 20;

export const ProductListTable = () => {
  const initialData = useLoaderData() as Awaited<ReturnType<ReturnType<typeof productsLoader>>>;

  const { searchParams, raw } = useProductTableQuery({ pageSize: PAGE_SIZE });
  const { products, count, isLoading, isError, error } = useProducts(
    {
      ...searchParams,
    },
    {
      initialData,
      placeholderData: keepPreviousData,
    }
  );

  const filters = useProductTableFilters();
  const columns = useColumns();

  const { table } = useDataTable({
    data: (products ?? []) as Product[],
    columns,
    count,
    enablePagination: true,
    pageSize: PAGE_SIZE,
    getRowId: (row: Product) => row.id,
  });

  if (isError) {
    throw error;
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Product</Heading>
        <Button size="small" variant="secondary" asChild>
          <Link to="create">Create</Link>
        </Button>
      </div>
      <DataTable
        table={table}
        columns={columns}
        count={count}
        pageSize={PAGE_SIZE}
        filters={filters}
        search
        pagination
        isLoading={isLoading}
        queryObject={raw}
        navigateTo={(row: any) => `${row.original.id}`}
        orderBy={['title', 'created_at', 'updated_at']}
      />
      <Outlet />
    </Container>
  );
};

const ProductActions = ({ product }: { product: Product }) => {
  const prompt = usePrompt();
  const { mutateAsync } = useDeleteProduct(product.id);

  const handleDelete = async () => {
    const res = await prompt({
      title: 'Are you sure?',
      description: `You are about to delete the product ${product.title}. This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (!res) {
      return;
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success('Product deleted', {
          description: `${product.title} was successfully deleted`,
          dismissLabel: 'Close',
        });
      },
      onError: (e) => {
        toast.error('Failed to delete product', {
          description: e.message,
          dismissLabel: 'Close',
        });
      },
    });
  };

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: 'Edit',
              to: `/products/${product.id}/edit`,
            },
          ],
        },
        {
          actions: [
            {
              icon: <Trash />,
              label: 'Delete',
              onClick: handleDelete,
            },
          ],
        },
      ]}
    />
  );
};

const columnHelper = createColumnHelper<Product>();

const useColumns = () => {
  const base = useProductTableColumns();

  const columns = useMemo(
    () => [
      ...base,
      columnHelper.display({
        id: 'actions',
        cell: ({ row }) => {
          return <ProductActions product={row.original} />;
        },
      }),
    ],
    [base]
  );

  return columns;
};
