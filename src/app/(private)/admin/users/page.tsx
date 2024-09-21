import { Breadcrumb } from "@/components/Breadcrumb";
import { UsersTable } from "./users-table";

export default async function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Breadcrumb items={[{ label: "Dashboard", link: "/admin" }, { label: "Users" }]} />
      </div>
      <UsersTable />
    </div>
  );
}