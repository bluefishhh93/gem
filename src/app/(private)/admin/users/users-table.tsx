import { columns } from "./columns";
import { DataTable } from "../charms/data-table";
import { getUsersUseCase } from "@/use-cases/users";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

async function UsersTableContent() {
  const users = await getUsersUseCase();

  return <DataTable columns={columns} data={users} />;
}

export async function UsersTable() {
  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<TableSkeleton />}>
        <UsersTableContent />
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