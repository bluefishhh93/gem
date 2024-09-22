"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"
import { vietnamCurrency } from "@/util/util"

interface ChartDataItem {
  month: string;
  revenue: number;
  fill: string;
}

interface RevenueChartContentProps {
  initialData: ChartDataItem[];
  chartConfig: ChartConfig;
  totalRevenue: number;
  averageRevenue: number;
}

export default function RevenueChartContent({ initialData, chartConfig, totalRevenue, averageRevenue }: RevenueChartContentProps) {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);

  useEffect(() => {
    setChartData(initialData);
  }, [initialData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Revenue</CardTitle>
        <CardDescription>Last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickFormatter={(value) => `${value / 1000}K`}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value) => [vietnamCurrency(value as number), "Revenue"]}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[8, 8, 0, 0]}>
              <LabelList
                dataKey="revenue"
                position="top"
                formatter={(value: number) => `${value / 1000}K`}
                offset={10}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardContent className="flex justify-between text-sm text-muted-foreground">
        <div>Total Revenue: {vietnamCurrency(totalRevenue)}</div>
        <div>Average Revenue: {vietnamCurrency(averageRevenue)}</div>
      </CardContent>
    </Card>
  )
}