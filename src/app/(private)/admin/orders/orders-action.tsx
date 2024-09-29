"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ViewOrderDialog from "./order-detail-modal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon, EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderType } from "./page";
import { UpdateOrderForm } from "./update-order-form";

export function OrdersAction({ order }: {
    order: any;
}) {
    const [isOpen, setIsOpen] = useState(false);
    console.log(order);

    return (
        <>
            {/* <Dialog
                open={isEditOrderOpen}
                onOpenChange={setIsEditOrderOpen}
            >
                <DialogTrigger>
                    <DropdownMenuItem>Update Order Status</DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Order Status</DialogTitle>
                    </DialogHeader>
                    <UpdateOrderForm order={order} setIsOpen={setIsEditOrderOpen} />
                </DialogContent>
            </Dialog> */}

            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <EllipsisVertical />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <UpdateOrderForm order={order}/>
                    <ViewOrderDialog selectedOrder={order} />
                </DropdownMenuContent>

            </DropdownMenu>
        </>
    )
}
