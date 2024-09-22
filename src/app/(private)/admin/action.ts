"use server";
import { authenticatedAction } from "@/lib/safe-action";
import { AuthorizationError } from "@/use-cases/errors";
import { z } from "zod";

export const adminOnlyAction = authenticatedAction
  .createServerAction()
  .input(z.object({
    // Define your input schema here
  }))
  .handler(async ({ input, ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new AuthorizationError();
    }

    return { success: true };
  });