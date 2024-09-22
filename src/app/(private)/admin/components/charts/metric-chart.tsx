import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, ShoppingCart, TrendingDown, TrendingUp, UserCircle } from "lucide-react"
import { vietnamCurrency } from "@/util/util"
import { getMetricDataUseCase } from "@/use-cases/charts";
import { Skeleton } from "@/components/ui/skeleton";
const cardData = [
  {
    title: "Today's Orders",
    icon: ShoppingCart,
    getValue: (data: any) => data.totalOrders.toString(),
  },
  {
    title: "Today's Income",
    icon: DollarSign,
    getValue: (data: any) => vietnamCurrency(data.totalIncome),
  },
  {
    title: "Pending Orders",
    icon: UserCircle,
    getValue: (data: any) => data.pendingOrders.toString(),
  },
  {
    title: "Outstock Products",
    icon: Package,
    getValue: (data: any) => data.totalOutstockProducts.toString(),
  },
]

export default async function MetricChart() {
  const metricData = await getMetricDataUseCase();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cardData.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {card.getValue(metricData)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function MetricChartSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cardData.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-4" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              <Skeleton className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
