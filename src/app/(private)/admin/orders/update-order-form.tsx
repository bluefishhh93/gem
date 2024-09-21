import { useState } from "react";
import { useServerAction } from "zsa-react";
import { updateOrderStatusAction } from "./action";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { OrderType } from "./page";
import { OrderStatus, PaymentStatus, ShippingStatus } from "@/types/enums";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const updateOrderSchema = z.object({
    orderStatus: z.nativeEnum(OrderStatus),
    paymentStatus: z.nativeEnum(PaymentStatus),
    shippingStatus: z.nativeEnum(ShippingStatus),
});

export function UpdateOrderForm({ order }: { order: OrderType }) {
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { execute, isPending } = useServerAction(updateOrderStatusAction, {
        onSuccess: () => {
            toast({
                variant: "success",
                title: "Order status updated",
                description: "The order status has been updated",
            });
            setIsDialogOpen(false);
        },
        onError: ({ err }) => {
            toast({
                variant: "destructive",
                title: "Error updating order",
                description: err.message || "An error occurred while updating the order status",
            });
        },
    });

    const form = useForm<z.infer<typeof updateOrderSchema>>({
        resolver: zodResolver(updateOrderSchema),
        defaultValues: {
            orderStatus: order.orderStatus as any,
            paymentStatus: order.paymentStatus as any,
            shippingStatus: order.shippingStatus as any,
        },
    });

    const onSubmit = async (values: z.infer<typeof updateOrderSchema>) => {
        await execute({
            orderId: order.id,
            ...values,
        });
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault();
                    setIsDialogOpen(true);
                }}
                >
                    Update
                </DropdownMenuItem>

            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Order Status</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="orderStatus"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Order Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select order status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(OrderStatus).map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {status}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="paymentStatus"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payment Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select payment status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(PaymentStatus).map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {status}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="shippingStatus"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Shipping Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select shipping status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(ShippingStatus).map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {status}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Updating..." : "Update Order"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}