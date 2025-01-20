import * as React from 'react';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { TableListSkeleton } from '@/components/common/table/table-list-selecton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useSalesTrend } from '@/hooks/api/analytics.hooks';

import { AnalyticsError } from './analytics-error';

const chartConfig = {
  views: {
    label: 'Sales',
  },
  sales: {
    label: 'Sales Trend',
    color: 'hsl(var(--foreground))',
  },
} satisfies ChartConfig;

export function SalesTrend() {
  const { results = [], isLoading, isError, error } = useSalesTrend(30);

  const chartData = results.map((item) => ({
    date: item.date,
    sales: item.sales,
  }));

  const total = React.useMemo(() => chartData.reduce((acc, curr) => acc + Number(curr.sales), 0), [chartData]);

  if (isLoading) {
    return <TableListSkeleton />;
  }

  return (
    <Card className="bg-muted/50">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b border-zinc-100 dark:border-zinc-800 p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Sales Trend</CardTitle>
          <CardDescription>Sales trend for the last month</CardDescription>
        </div>
        <div className="flex">
          {isError ? (
            <div />
          ) : (
            <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l border-zinc-100 dark:border-zinc-800  sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
              <span className="text-xs text-muted-foreground">{chartConfig['sales'].label}</span>
              <span className="text-lg font-bold leading-none sm:text-3xl">₨ {total.toFixed(0)}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {isError ? (
          <AnalyticsError error={error} />
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="views"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      });
                    }}
                  />
                }
              />
              <Bar dataKey="sales" fill={`var(--color-sales)`} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
