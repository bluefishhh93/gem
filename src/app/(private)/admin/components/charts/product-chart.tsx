import ProductChartContent from "./product-chart-content"
import { getTopSellingProductsUseCase } from "@/use-cases/charts"

export const description = "A bar chart showing top selling products"

const colors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default async function ProductChart() {
  const rawData = await getTopSellingProductsUseCase()
  
  const formattedData = rawData.map((item, index) => ({
    product: item.product,
    sales: item.sales,
    fill: colors[index % colors.length]
  }));

  const chartConfig = Object.fromEntries(
    formattedData.map((data, index) => [
      data.product,
      {
        label: `${data.product}`,
        color: colors[index % colors.length]
      }
    ])
  );

  const topSeller = formattedData.reduce((max, item) => item.sales > max.sales ? item : max, formattedData[0]);

  return (
    <ProductChartContent 
      initialData={formattedData} 
      chartConfig={chartConfig}
      topSeller={topSeller}
    />
  )
}