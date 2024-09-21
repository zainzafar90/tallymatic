import * as React from 'react';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
  { date: '2024-08-01', sales: 222 },
  { date: '2024-08-02', sales: 97 },
  { date: '2024-08-03', sales: 167 },
  { date: '2024-08-04', sales: 242 },
  { date: '2024-08-05', sales: 373 },
  { date: '2024-08-06', sales: 301 },
  { date: '2024-08-07', sales: 245 },
  { date: '2024-08-08', sales: 409 },
  { date: '2024-08-09', sales: 59 },
  { date: '2024-08-10', sales: 261 },
  { date: '2024-08-11', sales: 327 },
  { date: '2024-08-12', sales: 292 },
  { date: '2024-08-13', sales: 342 },
  { date: '2024-08-14', sales: 137 },
  { date: '2024-08-15', sales: 120 },
  { date: '2024-08-16', sales: 138 },
  { date: '2024-08-17', sales: 446 },
  { date: '2024-08-18', sales: 364 },
  { date: '2024-08-19', sales: 243 },
  { date: '2024-08-20', sales: 89 },
  { date: '2024-08-21', sales: 137 },
  { date: '2024-08-22', sales: 224 },
  { date: '2024-08-23', sales: 138 },
  { date: '2024-08-24', sales: 387 },
  { date: '2024-08-25', sales: 215 },
  { date: '2024-08-26', sales: 75 },
  { date: '2024-08-27', sales: 383 },
  { date: '2024-08-28', sales: 122 },
  { date: '2024-08-29', sales: 315 },
  { date: '2024-08-30', sales: 454 },
];

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
  const total = React.useMemo(
    () => ({
      sales: chartData.reduce((acc, curr) => acc + curr.sales, 0),
    }),
    []
  );

  return (
    <div className="mt-4">
      <div className="mt-4">
        <Card className="bg-muted/50">
          <CardHeader className="flex flex-col items-stretch space-y-0 border-b border-zinc-100 dark:border-zinc-800 p-0 sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
              <CardTitle>Sales Trend</CardTitle>
              <CardDescription>Sales trend for the last month</CardDescription>
            </div>
            <div className="flex">
              <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l border-zinc-100 dark:border-zinc-800  sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
                <span className="text-xs text-muted-foreground">{chartConfig['sales'].label}</span>
                <span className="text-lg font-bold leading-none sm:text-3xl">₨ {total['sales'].toLocaleString()}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:p-6">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
