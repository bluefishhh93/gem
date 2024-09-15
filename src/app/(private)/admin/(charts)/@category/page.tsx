"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, Pie, PieChart } from "recharts"

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

export const description = "A pie chart showing sales by charm bracelet category"

const chartData = [
  { category: "Classic", sales: 1860, fill: "var(--color-classic)" },
  { category: "Themed", sales: 3050, fill: "var(--color-themed)" },
  { category: "Personalized", sales: 2370, fill: "var(--color-personalized)" },
  { category: "Luxury", sales: 730, fill: "var(--color-luxury)" },
  { category: "Seasonal", sales: 2090, fill: "var(--color-seasonal)" },
  { category: "Children's", sales: 2140, fill: "var(--color-childrens)" },
]

const chartConfig = {
  sales: {
    label: "Sales",
  },
  classic: {
    label: "Classic",
    color: "hsl(var(--chart-1))",
  },
  themed: {
    label: "Themed",
    color: "hsl(var(--chart-2))",
  },
  personalized: {
    label: "Personalized",
    color: "hsl(var(--chart-3))",
  },
  luxury: {
    label: "Luxury",
    color: "hsl(var(--chart-4))",
  },
  seasonal: {
    label: "Seasonal",
    color: "hsl(var(--chart-5))",
  },
  childrens: {
    label: "Children's",
    color: "hsl(var(--chart-6))",
  },
} satisfies ChartConfig

export default function CategoryChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Charm Bracelet Sales by Category</CardTitle>
        <CardDescription>Last 6 Months</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="sales" hideLabel />}
            />
            <Pie data={chartData} dataKey="sales">
              <LabelList
                dataKey="category"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: string) =>
                  chartConfig[value.toLowerCase() as keyof typeof chartConfig]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total sales by charm bracelet category for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
