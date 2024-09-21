'use client';
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/db/schema";
import { UserActions } from "./user-actions";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex justify-center">

          <UserActions user={user} />
        </div>
      );

    },
  }
];