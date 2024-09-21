import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const pendingOrders = [
  { id: 'PO-001', supplier: 'Tech Supplies Inc.', items: 'Laptops, Tablets', total: '$12,500', dueDate: '2024-03-15' },
  { id: 'PO-002', supplier: 'Office Depot', items: 'Printers, Paper', total: '$3,200', dueDate: '2024-03-18' },
  { id: 'PO-003', supplier: 'Electronics Wholesale', items: 'Smartphones', total: '$8,900', dueDate: '2024-03-20' },
  { id: 'PO-004', supplier: 'Gadget World', items: 'Smartwatches, Earbuds', total: '$5,600', dueDate: '2024-03-22' },
];

export function PendingPurchaseOrders() {
  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle>Pending Purchase Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Supplier & Items</TableHeader>
              <TableHeader className="text-right">Total</TableHeader>
              <TableHeader className="hidden md:table-cell lg:hidden xl:table-cell">Due Date</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="font-medium">{order.supplier}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">{order.items}</div>
                </TableCell>
                <TableCell className="text-right">{order.total}</TableCell>
                <TableCell className="hidden md:table-cell lg:hidden xl:table-cell">{order.dueDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
