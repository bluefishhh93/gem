"use client"

import { TrendingUp, Package } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis, Tooltip, LabelList, ResponsiveContainer } from "recharts"

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

export const description = "A bar chart showing top selling products"

const chartData = [
  { product: "Classic Charm", sales: 1860, fill: "var(--color-classic)" },
  { product: "Themed Set", sales: 3050, fill: "var(--color-themed)" },
  { product: "Personalized Bracelet", sales: 2370, fill: "var(--color-personalized)" },
  { product: "Luxury Collection", sales: 730, fill: "var(--color-luxury)" },
  { product: "Seasonal Special", sales: 2090, fill: "var(--color-seasonal)" },
]

const chartConfig = {
  sales: {
    label: "Sales",
  },
  classic: {
    label: "Classic Charm",
    color: "hsl(var(--chart-1))",
  },
  themed: {
    label: "Themed Set",
    color: "hsl(var(--chart-2))",
  },
  personalized: {
    label: "Personalized Bracelet",
    color: "hsl(var(--chart-3))",
  },
  luxury: {
    label: "Luxury Collection",
    color: "hsl(var(--chart-4))",
  },
  seasonal: {
    label: "Seasonal Special",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export default function ProductChart() {
  return (
    <ResponsiveContainer width="100%">
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
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
                width={150}
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
            Top seller: Themed Set (3,050 units)
          </div>
          <div className="flex gap-2 font-medium leading-none">
            <TrendingUp className="h-4 w-4" />
            Overall sales trending up by 5.2% this month
          </div>
          <div className="leading-none text-muted-foreground">
            Showing top 5 selling products for the last 6 months
          </div>
        </CardFooter>
      </Card>
    </ResponsiveContainer>

  )
}
