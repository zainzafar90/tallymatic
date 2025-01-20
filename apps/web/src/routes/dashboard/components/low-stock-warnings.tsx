import { TableListSkeleton } from '@/components/common/table/table-list-selecton';
import { StockStatus } from '@/components/table/table-cells/common/stock-status-cell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLowStockAlerts } from '@/hooks/api/analytics.hooks';

import { AnalyticsError } from './analytics-error';

export const LowStockWarnings = () => {
  const { results = [], isLoading, isError, error } = useLowStockAlerts();

  if (isLoading) {
    return <TableListSkeleton />;
  }

  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle>Low Stock Warnings</CardTitle>
      </CardHeader>
      <CardContent>
        {isError ? (
          <AnalyticsError error={error} />
        ) : (
          <Table dense>
            <TableHead>
              <TableRow>
                <TableHeader>Product Name</TableHeader>
                <TableHeader className="hidden md:table-cell">Current Stock</TableHeader>
                <TableHeader className="hidden md:table-cell lg:hidden xl:table-cell">Min Stock</TableHeader>
                <TableHeader>Status</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex flex-col h-full w-full gap-x-3 overflow-hidden">
                      <h6 className="truncate text-sm">{item.productName}</h6>
                      <p className="text-xs text-gray-500">{item.name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{item.stock}</TableCell>
                  <TableCell className="hidden md:table-cell lg:hidden xl:table-cell">{item.lowStockThreshold}</TableCell>
                  <TableCell>
                    <StockStatus stock={item.stock} lowStockThreshold={item.lowStockThreshold} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
