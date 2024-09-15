"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, ShoppingCart, TrendingDown, TrendingUp, UserCircle } from "lucide-react"

const cardData = [
  {
    title: "Today's Orders",
    value: "156",
    icon: ShoppingCart,
    trend: "+12%",
    trendDirection: "up",
  },
  {
    title: "Today's Income",
    value: "$3,245",
    icon: DollarSign,
    trend: "+8%",
    trendDirection: "up",
  },
  {
    title: "New Customers",
    value: "32",
    icon: UserCircle,
    trend: "+5%",
    trendDirection: "up",
  },
  {
    title: "Total Products",
    value: "1,789",
    icon: Package,
    trend: "+3%",
    trendDirection: "up",
  },
]

export default function MetricChart() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cardData.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{card.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`inline-flex items-center ${card.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {card.trendDirection === 'up' ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
                {card.trend}
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
