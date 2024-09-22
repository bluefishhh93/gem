"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, Pie, PieChart } from "recharts"
import { useEffect, useState } from "react"

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


interface ChartDataItem {
    category: string;
    sales: number;
    fill: string;
}

interface CategoryChartContentProps {
    initialData: { category: string; sales: number }[];
}

const colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--chart-6))",
    "hsl(var(--chart-7))",
    "hsl(var(--chart-8))",
    "hsl(var(--chart-9))",
    "hsl(var(--chart-10))"
];
export default function CategoryChartContent({ initialData }: CategoryChartContentProps) {
    const [chartData, setChartData] = useState<ChartDataItem[]>([]);
    const chartConfig = Object.fromEntries(
        initialData.map((data, index) => [
            data.category,
            {
                label: `${data.category}`,
                color: `hsl(var(--chart-${index + 1}))`
            }
        ])
    ) satisfies ChartConfig;


    useEffect(() => {
        setChartData(
            initialData.map((item, index) => ({
                category: item.category,
                sales: item.sales,
                fill: colors[index % colors.length]
            }))
        );
    }, [initialData])

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
                            content={<ChartTooltipContent nameKey="category" hideLabel />}
                        />
                        <Pie data={chartData} dataKey="sales">
                            <LabelList
                                dataKey="category"
                                className="fill-background"
                                stroke="none"
                                fontSize={12}
                                formatter={(value: string) => value}
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