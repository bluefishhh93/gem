import { Package, TrendingUp } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function Loading() {
    return (
        <ProductChartSkeleton />
    )
}

const ProductChartSkeleton = () => {

    return (
        <Card>
            <CardHeader>
                <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
                <CardDescription><Skeleton className="h-4 w-36" /></CardDescription>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[300px] w-full" />
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    <Package className="h-4 w-4" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex gap-2 font-medium leading-none">
                    <TrendingUp className="h-4 w-4" />
                    <Skeleton className="h-4 w-56" />
                </div>
                <div className="leading-none text-muted-foreground">
                    <Skeleton className="h-4 w-64" />
                </div>
            </CardFooter>
        </Card>
    )
}
