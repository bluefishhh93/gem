"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LabelList } from "recharts"
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
  ChartTooltip,
} from "@/components/ui/chart"

interface ChartDataItem {
  category: string;
  sales: number;
  fill: string;
}

interface CategoryChartContentProps {
  initialData: ChartDataItem[];
  chartConfig: ChartConfig;
}

export default function CategoryChartContent({ initialData, chartConfig }: CategoryChartContentProps) {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);

  useEffect(() => {
    setChartData(initialData);
  }, [initialData]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Charm Bracelet Sales by Category</CardTitle>
        <CardDescription>This month</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={({ payload }) => {
                if (payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Category
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {data.category}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Sales
                          </span>
                          <span className="font-bold">{data.sales}</span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null;
              }}
            />
            <Pie
              data={chartData}
              dataKey="sales"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={50}
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <LabelList
                dataKey="category"
                position="outside"
                className="fill-muted-foreground text-sm"
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}