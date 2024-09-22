import CategoryChartContent from "./category-chart-content"
import { getSalesByCategoryUseCase } from "@/use-cases/charts"

export const description = "A pie chart showing sales by charm bracelet category"

const colors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default async function CategoryChart() {
  const rawData = await getSalesByCategoryUseCase()
  
  const formattedData = rawData.map((item, index) => ({
    category: item.category,
    sales: item.sales,
    fill: colors[index % colors.length]
  }));

  const chartConfig = Object.fromEntries(
    formattedData.map((data, index) => [
      data.category,
      {
        label: `${data.category}`,
        color: colors[index % colors.length]
      }
    ])
  );

  return <CategoryChartContent initialData={formattedData} chartConfig={chartConfig} />
}