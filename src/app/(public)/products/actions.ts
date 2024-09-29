'use server';

import { adminOnlyAction, unauthenticatedAction } from "@/lib/safe-action";
import { deleteReviewUseCase } from "@/use-cases/reviews";
import { getUserProfileUseCase } from "@/use-cases/users";
import { revalidatePath } from "next/cache";
import { z } from "zod";


export const deleteReviewAction = adminOnlyAction.
createServerAction()
.input(z.object({
    reviewId: z.number(),
    productId: z.number()
}))
.handler(async ({input}) => {
    await deleteReviewUseCase(input.reviewId);
    revalidatePath(`/products/${input.productId}`);
})

export const getUserProfileAction = unauthenticatedAction
.createServerAction()
.input(z.object({
    userId: z.number()
}))
.handler(async ({input}) => {
    const profile = await getUserProfileUseCase(input.userId);
    return profile;
})
