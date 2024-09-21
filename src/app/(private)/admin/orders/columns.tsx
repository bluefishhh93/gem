'use client';
import { Button } from "@/components/ui/button";
import { Order } from "@/db/schema";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { OrdersAction } from "./orders-action";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "userId",
    header: "User ID",
    cell: ({ row }) => <div className="font-medium">{row.getValue("userId")}</div>,
  },
  {
    accessorKey: "orderStatus",
    header: ({ column }) => {
      return (
        <select
          onChange={(e) => column.setFilterValue(e.target.value)}
          value={column.getFilterValue() as string}
          className="w-[180px]"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="canceled">Canceled</option>
        </select>
      )
    },
    cell: ({ row }) => {
      const status = row.getValue("orderStatus") as string;
      return (
        <Badge
          className={
            status === "pending" ? "bg-yellow-100 text-yellow-800" :
            status === "processing" ? "bg-blue-100 text-blue-800" :
            status === "shipped" ? "bg-purple-100 text-purple-800" :
            status === "delivered" ? "bg-green-100 text-green-800" :
            "bg-red-100 text-red-800"
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value === "" || row.getValue(id) === value;
    }
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full font-semibold text-left"
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="font-medium">
        {new Date(row.getValue("createdAt")).toLocaleDateString()}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="flex justify-center">
          <OrdersAction order={order as any} />
        </div>
      );
    },
  }
]