"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { vietnamCurrency } from "@/util/util";
import { OrderType } from "./page";
import CustomBraceletImage from "@/components/custom-bracelet-image";
import Image from "next/image";

interface ViewOrderDialogProps {
    selectedOrder: OrderType;
};

const ViewOrderDialog: React.FC<ViewOrderDialogProps> = ({ selectedOrder }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Detail
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Order Details</DialogTitle>
                    <DialogDescription>
                        Order #{selectedOrder.id} -{" "}
                        {new Date(selectedOrder.createdAt).toLocaleString()}
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="customer-info" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger
                            value="customer-info"
                            className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
                        >
                            Customer Information
                        </TabsTrigger>
                        <TabsTrigger
                            value="order-items"
                            className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
                        >
                            Order Items
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="customer-info">
                        <ScrollArea className="h-[300px] w-full rounded-md border p-6">
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <InfoItem label="Name" value={selectedOrder.name!} />
                                    <InfoItem label="Phone" value={selectedOrder.phone!} />
                                </div>
                                <InfoItem label="Email" value={selectedOrder.email!} />
                                <InfoItem
                                    label="Shipping Address"
                                    value={selectedOrder.shipAddress!}
                                />
                                <div className="grid grid-cols-3 gap-4">
                                    <InfoItem label="Order Status" value={selectedOrder.orderStatus!} />
                                    <InfoItem label="Payment Status" value={selectedOrder.paymentMethod!} />
                                    <InfoItem label="Ship Status" value={selectedOrder.shippingStatus!} />
                                </div>
                                <InfoItem

                                    label="Total Amount"
                                    value={vietnamCurrency(selectedOrder.total)}
                                />
                            </div>
                        </ScrollArea>

                    </TabsContent>
                    <TabsContent value="order-items">
                        <ScrollArea className="h-[300px] w-full rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Image</TableHead>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Subtotal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedOrder.orderItems.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {item.product ? (
                                                    <Image
                                                        src={item.product.imgProducts[0]?.imageUrl || "/path/to/default-image.jpg"}
                                                        alt={item.product.name}
                                                        width={50}
                                                        height={50}
                                                        className="rounded-md object-cover"
                                                    />
                                                ) : item.customBracelet ? (
                                                    <CustomBraceletImage
                                                        stringType={item.customBracelet.string}
                                                        charms={item.customBracelet.charms}
                                                    />
                                                ) : (
                                                    <div className="w-[50px] h-[50px] bg-gray-200 rounded-md"></div>
                                                )}
                                            </TableCell>
                                            <TableCell>{item.product?.name || `Vòng tay custom ${item.customBracelet?.id}`}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>
                                                {vietnamCurrency(item.product?.price || item.customBracelet?.totalPrice!)}
                                            </TableCell>
                                            <TableCell>{vietnamCurrency(item.subtotal)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </DialogContent>

        </Dialog>
    );
};

const InfoItem: React.FC<{ label: string; value: string }> = ({
    label,
    value,
}) => (
    <div className="flex flex-col space-y-1">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <span className="text-base">{value}</span>
    </div>
);

export default ViewOrderDialog;
