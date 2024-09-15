import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, ShoppingCart } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const skeletonCards = [
  { icon: ShoppingCart },
  { icon: DollarSign },
  { icon: Package },
  { icon: Package },
]

export function Loading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {skeletonCards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Skeleton className="h-4 w-24" />
            </CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-20 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}