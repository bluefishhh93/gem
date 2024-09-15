import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "./products-table";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-64" /> {/* Breadcrumb skeleton */}
        <Skeleton className="h-10 w-40" /> {/* Create Product button skeleton */}
      </div>
      <TableSkeleton />
    </div>
  );
}