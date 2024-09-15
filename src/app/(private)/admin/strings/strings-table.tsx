import { columns } from "./column";
import { DataTable } from "../charms/data-table";
import { getStringsUseCase } from "@/use-cases/strings";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

async function StringsTableContent() {
  const strings = await getStringsUseCase();

  return <DataTable columns={columns} data={strings} />;
}

export async function StringsTable() {
  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<TableSkeleton />}>
        <StringsTableContent />
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