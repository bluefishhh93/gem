"use server";

import { adminOnlyAction } from "@/lib/safe-action";
import { z } from "zod";
import { createCategoryUseCase, deleteCategoryUseCase, updateCategoryUseCase } from "@/use-cases/categories";
import { revalidatePath } from "next/cache";

export const createCategoryAction = adminOnlyAction
  .createServerAction()
  .input(
    z.object({
      name: z.string().min(1),
      isActive: z.boolean().optional(),
    })
  )
  .handler(async ({
    input: { name, isActive },
    ctx: { user },
  }) => {
    await createCategoryUseCase({
      name,
      isActive: isActive ?? true,
    });
    revalidatePath("/admin/categories");
  });

export const deleteCategoryAction = adminOnlyAction
  .createServerAction()
  .input(z.object({
    categoryId: z.number()
  }))
  .handler(async ({
    input: { categoryId },
    ctx: { user },
  }) => {
    await deleteCategoryUseCase(categoryId);
    revalidatePath("/admin/categories");
  });

export const updateCategoryAction = adminOnlyAction
  .createServerAction()
  .input(
    z.object({
      id: z.number(),
      name: z.string().min(1),
      isActive: z.boolean(),
    })
  )
  .handler(async ({
    input: { id, name, isActive },
    ctx: { user },
  }) => {
    await updateCategoryUseCase(id, {
      name,
      isActive,
    });
    revalidatePath("/admin/categories");
  });