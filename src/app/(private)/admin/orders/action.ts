'use server';

import { adminOnlyAction } from "@/lib/safe-action";
import { updateOrderUseCase } from "@/use-cases/orders";
import { z } from "zod";
import { OrderStatus, PaymentStatus, ShippingStatus } from "@/types/enums";
import { revalidatePath } from "next/cache";


const updateOrderInputSchema = z.object({

    orderId: z.number(),
    orderStatus: z.nativeEnum(OrderStatus).optional(),
    paymentStatus: z.nativeEnum(PaymentStatus).optional(),
    shippingStatus: z.nativeEnum(ShippingStatus).optional(),
});

export type UpdateOrderInput = z.infer<typeof updateOrderInputSchema>;

export const updateOrderStatusAction = adminOnlyAction
    .createServerAction()
    .input(updateOrderInputSchema)
    .handler(async ({ input, ctx: { user } }) => {
        const updatedOrder = await updateOrderUseCase(input.orderId, input);
        revalidatePath("/admin/orders");
        return updatedOrder;
    });