import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const lowStockItems = [
  { id: 1, name: 'iPhone 13 Pro', currentStock: 5, minStock: 10, status: 'Critical' },
  { id: 2, name: 'Samsung Galaxy S21', currentStock: 8, minStock: 15, status: 'Low' },
  { id: 3, name: 'MacBook Air M1', currentStock: 3, minStock: 8, status: 'Critical' },
  { id: 4, name: 'AirPods Pro', currentStock: 12, minStock: 20, status: 'Low' },
];

export function LowStockWarnings() {
  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle>Low Stock Warnings</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Product Name</TableHeader>
              <TableHeader className="hidden md:table-cell">Current Stock</TableHeader>
              <TableHeader className="hidden md:table-cell lg:hidden xl:table-cell">Min Stock</TableHeader>
              <TableHeader>Status</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {lowStockItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell className="hidden md:table-cell">{item.currentStock}</TableCell>
                <TableCell className="hidden md:table-cell lg:hidden xl:table-cell">{item.minStock}</TableCell>
                <TableCell>
                  <Badge color={item.status === 'Critical' ? 'red' : 'yellow'}>{item.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
