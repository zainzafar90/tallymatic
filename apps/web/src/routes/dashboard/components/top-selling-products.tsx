import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

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
  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
        <CardDescription>Showing the top selling products</CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
