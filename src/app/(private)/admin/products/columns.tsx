"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ImgProduct, Product } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { vietnamCurrency } from "@/util/util";
import { ProductCardActions } from "./product-actions";
import { Badge } from "@/components/ui/badge";


export const columns: ColumnDef<{
    id: number;
    name: string;
    price: number;
    currentQuantity: number;
    description: string;
    categoryId: number;
    imgProducts: ImgProduct[];
    salePrice: number;
}>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="w-full font-semibold text-left"
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
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
        accessorKey: "currentQuantity",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="w-full font-semibold text-center"
                >
                    Quantity
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
             const stock = parseInt(row.getValue("currentQuantity"));
             let color  = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
             if (stock <= 10) {
                color = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
             } else if (stock <= 50) {
                color = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
             }
            return (
                <Badge className={`${color} font-medium mx-auto`}>
                    {stock}
                </Badge>
            )
        }
    },
    {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className="flex justify-center">
              <ProductCardActions product={product} />
            </div>
          );
        },
    }
]