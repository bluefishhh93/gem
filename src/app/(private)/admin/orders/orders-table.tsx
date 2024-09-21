import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "../charms/data-table";
import { Suspense } from "react";
import { getOrdersUseCase } from "@/use-cases/orders";
import { columns as orderColumns } from "./columns";


async function OrdersTableContent() {
  const orders = await getOrdersUseCase();

  return <DataTable columns={orderColumns} data={orders} />;
}


export async function OrdersTable() {
  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<TableSkeleton />}>
        <OrdersTableContent />
      </Suspense>
    </div>
  );
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

