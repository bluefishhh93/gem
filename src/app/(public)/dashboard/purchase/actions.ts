"use server";
import { authenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { cancelOrderUsecase } from "@/use-cases/orders";
import { revalidatePath } from "next/cache";
import { createReviewUseCase } from "@/use-cases/reviews";
export const cancelOrderAction = authenticatedAction
.createServerAction()
.input(z.object({
    orderId: z.number(),
}))
.handler(async ({ input }) => {
   const order = await cancelOrderUsecase(input.orderId);
});


export const createReviewAction = authenticatedAction
.createServerAction()
.input(z.object({
    orderItemId: z.number(),
    productId: z.number(),
    rating: z.number().min(1).max(5),
    comment: z.string().max(200).optional(),
    formData: z.instanceof(FormData)
}))
.handler(async ({ input, ctx: {user} }) => {
    const { orderItemId, productId, rating, comment, formData } = input;
    const images = formData.getAll("images") as File[];

   
    await createReviewUseCase({
        userId: user.id,
        orderItemId,
        productId,
        rating,
        comment,
        images
      });
  
    revalidatePath("/dashboard/purchase");

});

