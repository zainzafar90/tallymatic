import { useEffect, useState } from 'react';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Divider } from '@/components/ui/divider';
import { Heading, Subheading } from '@/components/ui/heading';
import { Select } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getOrders } from '@/data';

import { SalesTrend } from './components/sales-trend';
import { TopSellingProducts } from './components/top-selling-products';

export function Stat({
  title,
  subtitle,
  value,
  change,
}: {
  title: string;
  subtitle: string;
  value: string;
  change: string;
}) {
  return (
    <div>
      <Divider />
      <div className="mt-6 text-lg/6 font-medium sm:text-sm/6">{title}</div>
      <div className="mt-3 text-3xl/8 font-semibold sm:text-2xl/8">{value}</div>
      <div className="mt-3 text-sm/6 sm:text-xs/6">
        <Badge color={change.startsWith('+') ? 'lime' : 'pink'}>{change}</Badge>{' '}
        <span className="text-zinc-500">{subtitle}</span>
      </div>
    </div>
  );
}

export const Dashboard = () => {
  const [orders, setOrders] = useState<Awaited<ReturnType<typeof getOrders>>>([]);

  useEffect(() => {
    (async () => {
      setOrders(await getOrders());
    })();
  }, []);

  return (
    <>
      <Heading>Good afternoon, Zain</Heading>
      <div className="mt-8 flex items-end justify-between">
        <Subheading>Overview</Subheading>
        <div>
          <Select name="period">
            <option value="last_day">Today's Sales</option>
            <option value="last_week">Last Week Sales</option>
            <option value="last_month">Last Month Sales</option>
            <option value="last_year">Year to Date Sales</option>
          </Select>
        </div>
      </div>
      <div className="mt-4 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        <Stat title="Today's Sales" subtitle="from yesterday" value="&#8360; 455" change="+4.5%" />
        <Stat title="Last Week Sales" subtitle="from last week" value="&#8360; 10,455" change="-0.5%" />
        <Stat title="Last Month Sales" subtitle="from last month" value="&#8360; 288,454" change="+4.5%" />
        <Stat title="Year to Date Sales" subtitle="from last year" value="&#8360; 2.6M" change="+21.2%" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SalesTrend />
        <TopSellingProducts />
        <div className="mt-14">
          <Subheading>Recent orders</Subheading>
          <Table className="mt-4 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
            <TableHead>
              <TableRow>
                <TableHeader>Order number</TableHeader>
                <TableHeader>Purchase date</TableHeader>
                <TableHeader>Customer</TableHeader>
                <TableHeader>Event</TableHeader>
                <TableHeader className="text-right">Amount</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} href={order.url} title={`Order #${order.id}`}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell className="text-zinc-500">{order.date}</TableCell>
                  <TableCell>{order.customer.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar src={order.event.thumbUrl} className="size-6" />
                      <span>{order.event.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">US{order.amount.usd}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};
