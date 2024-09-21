'use server';
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { toggleUserRoleUseCase } from "@/use-cases/users";
import { adminOnlyAction } from "@/lib/safe-action";


export const toggleUserRoleAction = adminOnlyAction
    .createServerAction()
    .input(z.object({ userId: z.number() }))
    .handler(async ({ input: { userId }, ctx: { user } }) => {
        await toggleUserRoleUseCase(user, userId);
        revalidatePath("/admin/users");
    });