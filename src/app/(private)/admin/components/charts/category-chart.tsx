import CategoryChartContent from "./category-chart-content"
import { getSalesByCategoryUseCase } from "@/use-cases/charts"

export const description = "A pie chart showing sales by charm bracelet category"

export default async function CategoryChart() {
  const data = await getSalesByCategoryUseCase()
  return <CategoryChartContent initialData={data} />
}