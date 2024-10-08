"use server";

import { authenticatedAction } from "@/lib/safe-action";

import { z } from "zod";
import { updateProfileImageUseCase, updateProfileNameUseCase } from "@/use-cases/users";
import { revalidatePath } from "next/cache";
import { rateLimitByKey } from "@/lib/limiter";

export const updateProfileImageAction = authenticatedAction
  .createServerAction()
  .input(
      z.object({
        url: z.string(),
    })
  )
  .handler(async ({ input, ctx }) => {
    await rateLimitByKey({
      key: `update-profile-image-${ctx.user.id}`,
      limit: 3,
      window: 60000,
    });
    
    await updateProfileImageUseCase(input.url, ctx.user.id);
    revalidatePath(`/dashboard/settings/profile`);
  });

export const updateProfileNameAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      profileName: z.string(),
    })
  )
  .handler(async ({ input, ctx }) => {
    await updateProfileNameUseCase(ctx.user.id, input.profileName);
    revalidatePath(`/dashboard/settings/profile`);
  });

// export const updateProfileBioAction = authenticatedAction
//   .createServerAction()
//   .input(
//     z.object({
//       bio: z.string(),
//     })
//   )
//   .handler(async ({ input, ctx }) => {
//     await updateProfileBioUseCase(ctx.user.id, sanitizeHtml(input.bio));
//     revalidatePath(`/dashboard/settings/profile`);
//   });
