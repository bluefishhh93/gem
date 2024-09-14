"use client";

import { ColumnDef } from "@tanstack/react-table";
import { String } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { vietnamCurrency } from "@/util/util";
import { StringCardActions } from "./strings-actions";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<String>[] = [
  {
    accessorKey: "color",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full font-semibold text-left"
        >
          Color
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("color")}</div>,
  },
  {
    accessorKey: "material",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full font-semibold text-left"
        >
          Material
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("material")}</div>,
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full font-semibold text-center"
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = vietnamCurrency(price);
      return <div className="font-medium text-center">{formatted}</div>;
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full font-semibold text-center"
        >
          Stock
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const stock = parseInt(row.getValue("stock"));
      let color = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      if (stock <= 10) color = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      else if (stock <= 50) color = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      return (
        <Badge className={`${color} font-medium mx-auto`}>
          {stock}
        </Badge>
      );
    },
  },
  {
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <Image
            src={row.getValue("imageUrl")}
            alt={row.getValue("color")}
            width={50}
            height={50}
            className="rounded-full object-cover border border-gray-200 dark:border-gray-700"
          />
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const string = row.original;
      return (
        <div className="flex justify-center">
          <StringCardActions string={string} />
        </div>
      );
    },
  }
];