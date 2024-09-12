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

    // Perform admin-only actions here
    console.log("Admin action performed");
    return { success: true };
  });