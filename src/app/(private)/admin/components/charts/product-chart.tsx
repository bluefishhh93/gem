import ProductChartContent from "./product-chart-content"
import { getTopSellingProductsUseCase } from "@/use-cases/charts"

export const description = "A bar chart showing top selling products"

export default async function ProductChart() {
  const data = await getTopSellingProductsUseCase()
  return <ProductChartContent initialData={data} />
}