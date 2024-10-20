"use client"

import { TrendingUp, Package } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis, Tooltip, LabelList, ResponsiveContainer } from "recharts"
import { useState, useEffect } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"

interface ChartDataItem {
  product: string;
  sales: number;
  fill: string;
}

interface ProductChartContentProps {
  initialData: ChartDataItem[];
  chartConfig: ChartConfig;
  topSeller: ChartDataItem;
}

export default function ProductChartContent({ initialData, chartConfig, topSeller }: ProductChartContentProps) {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);

  useEffect(() => {
    setChartData(initialData);
  }, [initialData]);

  return (
    <ResponsiveContainer width="100%">
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
          <CardDescription>This month</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <YAxis
                dataKey="product"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                width={50}
              />
              <XAxis dataKey="sales" type="number" hide />
              <Tooltip
                formatter={(value) => [`${value} units`, "Sales"]}
                labelFormatter={(label) => `Product: ${label}`}
              />
              <Bar dataKey="sales" fill="var(--color-primary)" radius={[0, 5, 5, 0]}>
                <LabelList dataKey="sales" position="right" formatter={(value: any) => `${value} units`} />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            <Package className="h-4 w-4" />
            {
              topSeller && (
                <span>Top seller: {topSeller.product} ({topSeller.sales} units)</span>
              )
            }
          </div>
          <div className="flex gap-2 font-medium leading-none">
            <TrendingUp className="h-4 w-4" />
            Overall sales trending up by 5.2% this month
          </div>
          <div className="leading-none text-muted-foreground">
            Showing top 5 selling products for this month
          </div>
        </CardFooter>
      </Card>
    </ResponsiveContainer>
  )
}