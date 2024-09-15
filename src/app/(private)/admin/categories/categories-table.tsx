import { columns } from "./columns";
import { DataTable } from "../charms/data-table";
import { getCategoriesUseCase } from "@/use-cases/categories";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

async function CategoriesTableContent() {
  const categories = await getCategoriesUseCase();

  return <DataTable columns={columns} data={categories} />;
}

export function CategoriesTable() {
  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<TableSkeleton />}>
        <CategoriesTableContent />
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