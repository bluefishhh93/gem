import RevenueChartContent from "./revenue-chart-content"
import { getMonthlyRevenueUseCase } from "@/use-cases/charts"

export const description = "A bar chart displaying monthly revenue"

export default async function RevenueChart() {
  const data = await getMonthlyRevenueUseCase()
  return <RevenueChartContent initialData={data} />
}