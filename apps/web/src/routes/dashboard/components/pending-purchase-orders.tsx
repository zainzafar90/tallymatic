import { LetterBox } from '@/components/common/letter-box/letter-box';
import { TableListSkeleton } from '@/components/common/table/table-list-selecton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePendingPurchaseOrders } from '@/hooks/api/analytics.hooks';
import { formatCurrency } from '@/lib/utils';

export function PendingPurchaseOrders() {
  const { results = [], isLoading, isError, error } = usePendingPurchaseOrders();

  if (isError) {
    throw error;
  }

  if (isLoading) {
    return <TableListSkeleton />;
  }

  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle>Pending Purchase Orders</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {results.map((sale) => (
          <div key={sale.id} className="flex items-center gap-4">
            <LetterBox text={sale.supplierName} />
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">Purchase #{sale.purchaseNumber}</p>
              <p className="text-sm text-muted-foreground">
                {sale.itemCount} items | {sale.supplierName}
              </p>
            </div>
            <div className="ml-auto font-medium">{formatCurrency(sale.totalAmount)}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
