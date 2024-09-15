import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getCharmsUseCase } from "@/use-cases/charms";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

async function CharmsTableContent() {
  const charms = await getCharmsUseCase();

  return <DataTable columns={columns} data={charms} />;
}

export async function CharmsTable() {
  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<TableSkeleton />}>
        <CharmsTableContent />
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