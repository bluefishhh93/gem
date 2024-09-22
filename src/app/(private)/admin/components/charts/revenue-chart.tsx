import RevenueChartContent from "./revenue-chart-content"
import { getMonthlyRevenueUseCase } from "@/use-cases/charts"

export const description = "A bar chart displaying monthly revenue"

const colors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
];

export default async function RevenueChart() {
  const rawData = await getMonthlyRevenueUseCase()
  
  const formattedData = rawData.map((item, index) => ({
    month: item.month,
    revenue: item.revenue,
    fill: colors[index % colors.length]
  }));

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "var(--color-revenue)"
    }
  };

  const totalRevenue = formattedData.reduce((sum, item) => sum + item.revenue, 0);
  const averageRevenue = totalRevenue / formattedData.length;

  return (
    <RevenueChartContent 
      initialData={formattedData} 
      chartConfig={chartConfig}
      totalRevenue={totalRevenue}
      averageRevenue={averageRevenue}
    />
  )
}