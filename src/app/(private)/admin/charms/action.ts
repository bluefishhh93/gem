"use server";

import { adminOnlyAction, authenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { database } from "@/db";
import { charms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AuthorizationError } from "@/use-cases/errors";
import { createCharm, deleteCharm, getCharmById, updateCharm } from "@/data-access/charms";
import { createCharmUseCase, deleteCharmUseCase, updateCharmUseCase } from "@/use-cases/charms";
import { revalidatePath } from "next/cache";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";



export const createCharmAction = adminOnlyAction
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

export const deleteCharmAction = authenticatedAction
  .createServerAction()
  .input(z.object({
    charmId: z.number()
  }))
  .handler(async ({
    input: { charmId },
    ctx: { user },
  }) => {
    await deleteCharmUseCase(user, charmId);
    revalidatePath("/admin/charms");

  });


  export const updateCharmAction = adminOnlyAction
  .createServerAction()
  .input(
    z.object({
      id: z.number(),
      name: z.string().min(1),
      price: z.number().positive(),
      stock: z.number().positive(),
      fileWrapper: z.instanceof(FormData).optional(),
    })
  )
  .handler(async ({
    input: { id, name, price, stock, fileWrapper },
    ctx: { user },
  }) => {
    let imageUrl: string | undefined;

    if (fileWrapper) {
      const charmImage = fileWrapper.get("file") as File;
      if (charmImage && charmImage instanceof File) {
        const oldCharm = await getCharmById(id);
        if (oldCharm && oldCharm.imageUrl) {
          // Delete old image from Cloudinary
          await deleteFromCloudinary(oldCharm.imageUrl);
        }
        const { secure_url } = await uploadToCloudinary(charmImage, {
          folder: 'charms',
        });
        imageUrl = secure_url;
      }
    }

    await updateCharmUseCase(user, {
      id,
      name,
      price,
      stock,
      imageUrl,
    });
    revalidatePath("/admin/charms");
  });