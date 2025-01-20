import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';

import { TableListSkeleton } from '@/components/common/table/table-list-selecton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useProfitByCategory } from '@/hooks/api/analytics.hooks';
import { formatCurrency } from '@/lib/utils';

import { AnalyticsError } from './analytics-error';

const chartConfig = {
  totalRevenue: {
    label: 'Revenue',
  },
} satisfies ChartConfig;

export function ProfitByCategory() {
  const { results = [], isLoading, isError, error } = useProfitByCategory(30);

  if (isLoading) {
    return <TableListSkeleton />;
  }

  const chartData = results.map((item, index) => ({
    categoryName: item.categoryName || 'Uncategorized',
    totalRevenue: item.totalRevenue,
    fill: `hsl(var(--chart-${(index % 5) + 1}))`,
  }));

  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle>Profit by Category</CardTitle>
        <CardDescription>Revenue breakdown by product category</CardDescription>
      </CardHeader>
      <CardContent>
        {isError ? (
          <AnalyticsError error={error} />
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                right: 40,
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="categoryName"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 15)}
                hide
              />
              <XAxis dataKey="totalRevenue" type="number" hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Bar dataKey="totalRevenue" layout="vertical" fill="var(--color-desktop)" radius={4}>
                <LabelList
                  dataKey="categoryName"
                  position="insideLeft"
                  offset={8}
                  className="fill-[--color-label]"
                  fontSize={12}
                />
                <LabelList
                  dataKey="totalRevenue"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                  formatter={formatCurrency}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
