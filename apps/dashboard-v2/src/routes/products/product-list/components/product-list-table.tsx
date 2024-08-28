import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useProducts } from '@/hooks/api/products';
import { useMe } from '@/hooks/api/users';

import { ProductListSkeleton } from './product-list-skeleton';

export const ProductListTable = () => {
  const { data } = useMe();

  const {
    results = [],
    isLoading,
    isError,
    error,
  } = useProducts({
    organizationId: data?.organizationId || '',
  });

  if (isError) {
    throw error;
  }

  return (
    <Table className="table-fixed mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader className="hidden sm:block">Description</TableHeader>
          <TableHeader className="text-right">Price</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {isLoading ? (
          <ProductListSkeleton />
        ) : (
          results.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell className="hidden sm:block truncate">
                <div className="truncate max-w-xs">{product.description}</div>
              </TableCell>
              <TableCell className="text-right">{product.price}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
