"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, Tooltip } from "recharts"
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
import { TrendingUp, DollarSign } from "lucide-react"
import { vietnamCurrency } from "@/util/util"

interface ChartDataItem {
  month: string;
  revenue: number;
}

interface RevenueChartContentProps {
  initialData: ChartDataItem[];
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function RevenueChartContent({ initialData }: RevenueChartContentProps) {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);

  useEffect(() => {
    setChartData(initialData);
  }, [initialData]);

  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0)
  const averageRevenue = totalRevenue / chartData.length

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
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          <DollarSign className="h-4 w-4" />
          Total Revenue: {vietnamCurrency(totalRevenue)}
        </div>
        <div className="flex gap-2 font-medium leading-none">
          <TrendingUp className="h-4 w-4" />
          Average Monthly Revenue: {vietnamCurrency(averageRevenue)}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing monthly revenue for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}