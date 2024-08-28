import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

export const ProductListSkeleton = () => {
  return Array.from({ length: 10 }).map((_, index) => (
    <TableRow key={index}>
      <TableCell>
        <Skeleton className="h-4 w-3/4" />
      </TableCell>
      <TableCell className="hidden sm:block">
        <Skeleton className="h-4 w-full" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-4 w-1/2 ml-auto" />
      </TableCell>
    </TableRow>
  ));
};
