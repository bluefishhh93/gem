"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, Tooltip } from "recharts"

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { TrendingUp, DollarSign } from "lucide-react"
import { vietnamCurrency } from "@/util/util"

export const description = "A bar chart displaying monthly revenue"

const chartData = [
  { month: "January", revenue: 1860000 },
  { month: "February", revenue: 3050000 },
  { month: "March", revenue: 2370000 },
  { month: "April", revenue: 7300000 },
  { month: "May", revenue: 2090000 },
  { month: "June", revenue: 2140000 },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function RevenueChart() {
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0)
  const averageRevenue = totalRevenue / chartData.length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Revenue</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
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
              tickFormatter={(value) => `${value / 1000000}M`}
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
                formatter={(value: number) => `${value / 1000000}M`}
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
