import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';

import { TableListSkeleton } from '@/components/common/table/table-list-selecton';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useTopSellingProducts } from '@/hooks/api/analytics.hooks';

import { AnalyticsError } from './analytics-error';

const chartData = [
  { productName: 'smartphone', itemsSold: 250, fill: 'hsl(var(--chart-1))' },
  { productName: 'laptop', itemsSold: 220, fill: 'hsl(var(--chart-2))' },
  { productName: 'tablet', itemsSold: 150, fill: 'hsl(var(--chart-3))' },
  { productName: 'smartwatch', itemsSold: 125, fill: 'hsl(var(--chart-4))' },
  { productName: 'headphones', itemsSold: 75, fill: 'hsl(var(--chart-5))' },
];

const chartConfig = {
  itemsSold: {
    label: 'Items Sold',
  },
  smartphone: {
    label: 'Smartphone',
    color: 'hsl(var(--chart-1))',
  },
  laptop: {
    label: 'Laptop',
    color: 'hsl(var(--chart-2))',
  },
  tablet: {
    label: 'Tablet',
    color: 'hsl(var(--chart-3))',
  },
  smartwatch: {
    label: 'Smartwatch',
    color: 'hsl(var(--chart-4))',
  },
  headphones: {
    label: 'Headphones',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

export function TopSellingProducts() {
  const { results = [], isLoading, isError, error } = useTopSellingProducts(30);

  if (isLoading) {
    return <TableListSkeleton />;
  }

  const chartData = results.map((item) => ({
    productName: item.name,
    itemsSold: item.totalRevenue,
    fill: `hsl(var(--chart-${Math.floor(Math.random() * 5) + 1}))`,
  }));

  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
        <CardDescription>Showing the top selling products</CardDescription>
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
                dataKey="productName"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                hide
              />
              <XAxis dataKey="itemsSold" type="number" hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Bar dataKey="itemsSold" layout="vertical" fill="var(--color-desktop)" radius={4}>
                <LabelList
                  dataKey="productName"
                  position="insideLeft"
                  offset={8}
                  className="fill-[--color-label]"
                  fontSize={12}
                />
                <LabelList dataKey="itemsSold" position="right" offset={8} className="fill-foreground" fontSize={12} />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
