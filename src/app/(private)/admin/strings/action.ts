"use server";

import { adminOnlyAction } from "@/lib/safe-action";
import { z } from "zod";
import { createStringUseCase, deleteStringUseCase, updateStringUseCase } from "@/use-cases/strings";
import { revalidatePath } from "next/cache";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { String } from "@/db/schema";

export const createStringAction = adminOnlyAction
  .createServerAction()
  .input(
    z.object({
      color: z.string().min(1),
      material: z.string().min(1),
      price: z.number().positive(),
      stock: z.number().positive(),
      fileWrapper: z.instanceof(FormData),
    })
  )
  .handler(async ({
    input: { color, material, price, stock, fileWrapper },
    ctx: { user },
  }) => {
    const stringImage = fileWrapper.get("file") as File;
    if (!stringImage || !(stringImage instanceof File)) {
      throw new Error("Invalid file");
    }

    await createStringUseCase(user, {
      color,
      material,
      price,
      stock,
      stringImage
    });
    revalidatePath("/admin/strings");
  });
export const deleteStringAction = adminOnlyAction
  .createServerAction()
  .input(z.object({
    stringId: z.number()
  }))
  .handler(async ({
    input: { stringId },
    ctx: { user },
  }) => {
    await deleteStringUseCase(stringId);
    revalidatePath("/admin/strings");
  });

  export const updateStringAction = adminOnlyAction
  .createServerAction()
  .input(z.object({
    id: z.number(),
    color: z.string().min(1).optional(),
    material: z.string().min(1).optional(),
    price: z.number().positive().optional(),
    stock: z.number().positive().optional(),
    fileWrapper: z.instanceof(FormData).optional(),
  }))
  .handler(async ({
    input: { id, color, material, price, stock, fileWrapper },
    ctx: { user },
  }) => {
    let imageUrl: string | undefined;

    if (fileWrapper) {
      const stringImage = fileWrapper.get("file") as File;
      if (!stringImage || !(stringImage instanceof File)) {
        throw new Error("Invalid file");
      }
      const result = await uploadToCloudinary(stringImage, {
        folder: 'strings',
      });
      imageUrl = result.secure_url;
    }

    const updateData: Partial<String> = {};
    if (color !== undefined) updateData.color = color;
    if (material !== undefined) updateData.material = material;
    if (price !== undefined) updateData.price = price;
    if (stock !== undefined) updateData.stock = stock;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    await updateStringUseCase(user, {
      id,
      ...updateData,
    });
    revalidatePath("/admin/strings");
  });
