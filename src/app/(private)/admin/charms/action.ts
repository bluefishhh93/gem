"use server";

import { authenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { database } from "@/db";
import { charms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AuthorizationError } from "@/use-cases/errors";
import { createCharm, deleteCharm, updateCharm } from "@/data-access/charms";
import { createCharmUseCase } from "@/use-cases/charms";
import { revalidatePath } from "next/cache";



export const createCharmAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      name: z.string().min(1),
      price: z.number().positive(),
      stock: z.number().positive(),
      fileWrapper: z.instanceof(FormData),
    })
  )
  .handler(async ({
    input: { name, price, stock, fileWrapper },
    ctx: { user },
  }) => {
    const charmImage = fileWrapper.get("file") as File;
    if (!charmImage || !(charmImage instanceof File)) {
      throw new Error("Invalid file");
    }

    await createCharmUseCase(user, {
      name,
      price,
      stock,
      charmImage
    });
    revalidatePath("/admin/charms");
  });
