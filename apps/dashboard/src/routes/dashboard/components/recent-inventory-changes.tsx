import { Link } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const transactions = [
  {
    id: 1,
    customer: 'Liam Johnson',
    email: 'liam@example.com',
    type: 'Sale',
    status: 'Approved',
    date: '2023-06-23',
    amount: '₨ 250.00',
  },
  {
    id: 2,
    customer: 'Olivia Smith',
    email: 'olivia@example.com',
    type: 'Refund',
    status: 'Declined',
    date: '2023-06-24',
    amount: '₨ 150.00',
  },
  {
    id: 3,
    customer: 'Noah Williams',
    email: 'noah@example.com',
    type: 'Subscription',
    status: 'Approved',
    date: '2023-06-25',
    amount: '₨ 350.00',
  },
  {
    id: 4,
    customer: 'Emma Brown',
    email: 'emma@example.com',
    type: 'Sale',
    status: 'Approved',
    date: '2023-06-26',
    amount: '₨ 450.00',
  },
  {
    id: 5,
    customer: 'Liam Johnson',
    email: 'liam@example.com',
    type: 'Sale',
    status: 'Approved',
    date: '2023-06-27',
    amount: '₨ 550.00',
  },
];

export function RecentInventoryChanges() {
  return (
    <Card className="bg-muted/50">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Transactions</CardTitle>
          <CardDescription>Recent transactions from your store.</CardDescription>
        </div>
        <Button className="ml-auto gap-1">
          <Link to="/">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table className="mt-4 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
          <TableHead>
            <TableRow>
              <TableHeader>Customer</TableHeader>
              <TableHeader className="hidden xl:table-column">Type</TableHeader>
              <TableHeader className="hidden xl:table-column">Status</TableHeader>
              <TableHeader className="hidden md:table-cell lg:hidden xl:table-cell">Date</TableHeader>
              <TableHeader className="text-right">Amount</TableHeader>
            </TableRow>
          </TableHead>

          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="font-medium">{transaction.customer}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">{transaction.email}</div>
                </TableCell>
                <TableCell className="hidden xl:table-column">{transaction.type}</TableCell>
                <TableCell className="hidden xl:table-column">
                  <Badge className="text-xs" color="zinc">
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell lg:hidden xl:table-cell">{transaction.date}</TableCell>
                <TableCell className="text-right">{transaction.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
