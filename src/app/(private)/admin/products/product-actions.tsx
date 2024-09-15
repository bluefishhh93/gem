"use client";

import { EllipsisVertical, PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteModal } from "@/components/delete-modal";
import { useServerAction } from "zsa-react";
import { deleteProductAction } from "./action";
import { ImgProduct, Product } from "@/db/schema";
import { btnIconStyles, btnStyles } from "@/styles/icons";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { InteractiveOverlay } from "@/components/interactive-overlay";
import { EditProductForm } from "./edit-product-form";

export function ProductCardActions({ product }: { product: {
  id: number;
  name: string;
  price: number;
  currentQuantity: number;
  description: string;
  categoryId: number;
  imgProducts: ImgProduct[];
  salePrice: number;
} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const { execute, isPending } = useServerAction(deleteProductAction, {
    onSuccess() {
      setIsOpen(false);
    },
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <InteractiveOverlay
        isOpen={isEditProductOpen}
        setIsOpen={setIsEditProductOpen}
        title={""}
        description={""}
        form={<EditProductForm product={product} setIsOpen={setIsEditProductOpen} />}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={() => {
          execute({
            productId: product.id,
          });
        }}
        isPending={isPending}
      />

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={"icon"}>
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={(e) => {
              setIsEditProductOpen(true);
            }}
            className={btnStyles}
          >
            <PencilIcon className={btnIconStyles} />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn(btnStyles, "text-red-500")}
            onClick={(e) => {
              setIsDeleteModalOpen(true);
            }}
          >
            <TrashIcon className={btnIconStyles} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}