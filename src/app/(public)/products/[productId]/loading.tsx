import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-md dark:bg-gray-800"
            >
              <div className="absolute inset-0 z-10" />
    
              {/* Skeleton Image */}
              <Skeleton className="h-48 w-full object-cover object-center" />
    
              {/* Product Info Skeleton */}
              <div className="p-4 bg-background dark:bg-gray-900">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-2" />
                <div className="mt-4 flex items-center justify-between">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
}

const ProductSkeleton = () => {

    return (
        <div className="group relative overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-md dark:bg-gray-800">
            
            {/* image skeleton */}
            <Skeleton className="h-48 w-full object-cover object-center" />

            


        </div>
    )
}