import { columns } from "./columns";
import { DataTable } from "../charms/data-table";
import { getProductsUseCase } from "@/use-cases/products";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

async function ProductsTableContent(){
    const products = await getProductsUseCase();

    return <DataTable columns={columns} data={products} />
}

export function ProductsTable(){
    return (
        <div className="container mx-auto py-10">
      <Suspense fallback={<TableSkeleton />}>
        <ProductsTableContent />
      </Suspense>
    </div> 
    )
}

export function TableSkeleton() {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }