import { TableListSkeleton } from '@/components/common/table/table-list-selecton';
import { Badge } from '@/components/ui/badge';
import { Divider } from '@/components/ui/divider';
import { useSalesSummary } from '@/hooks/api/analytics.hooks';
import { formatCurrency } from '@/lib/utils';

import { AnalyticsError } from './analytics-error';

interface SalesCardProps {
  title: string;
  amount: number;
  growth: number;
  comparedTo: string;
}

export function SalesSummary() {
  const { data, isLoading, isError, error } = useSalesSummary();

  if (isLoading || !data) {
    return <TableListSkeleton />;
  }

  if (isError) {
    return <AnalyticsError error={error} />;
  }

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SalesCard title="Today's Sales" {...data.today} />
      <SalesCard title="Last Week Sales" {...data.week} />
      <SalesCard title="Last Month Sales" {...data.month} />
      <SalesCard title="Avg Order Value" {...data.avgOrderValuePerDayThisMonth} />
    </div>
  );
}

function SalesCard({ title, amount, growth, comparedTo }: SalesCardProps) {
  const isPositive = growth >= 0;

  return (
    <div className="flex flex-col gap-1">
      <Divider />
      <div className="mt-4 text-lg/6 font-medium sm:text-sm/6">{title}</div>
      <div className="mt-2 text-3xl/8 font-semibold sm:text-2xl/8">{formatCurrency(amount)}</div>
      <div className="mt-2 text-sm/6 sm:text-xs/6">
        <Badge color={isPositive ? 'lime' : 'pink'}>{growth.toFixed(1)}%</Badge>{' '}
        <span className="text-zinc-500">from {comparedTo}</span>
      </div>
    </div>
  );
}
