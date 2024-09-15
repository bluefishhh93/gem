"use server";
import { adminOnlyAction } from "@/lib/safe-action";
import { createProductUseCase, deleteProductUseCase, updateProductUseCase } from "@/use-cases/products";
import { revalidatePath } from "next/cache";
import { z } from "zod";



export const createProductAction = adminOnlyAction
    .createServerAction()
    .input(z.object({
        name: z.string(),
        price: z.number().positive(),
        stock: z.number().positive(),
        description: z.string(),
        categoryId: z.number().positive(),
        fileWrapper: z.instanceof(FormData)
    }))
    .handler(async({
        input: {name, price , stock, description, categoryId, fileWrapper },
        ctx: {user}
    }) => {
        const productImages = fileWrapper.getAll("files") as File[];
        if(!productImages || productImages.length === 0){
            throw new Error("No images provided")
        }
        await createProductUseCase({
            name,
            price,
            stock,
            description,
            categoryId,
            productImage: productImages
        })

        revalidatePath("/admin/products")
    })

export const deleteProductAction = adminOnlyAction
    .createServerAction()
    .input(z.object({
        productId: z.number()
    }))
    .handler(async({
        input: {productId},
        ctx: {user}
    }) => {
        await deleteProductUseCase(productId)
        revalidatePath("/admin/products")
    })

    export const updateProductAction = adminOnlyAction
    .createServerAction()
    .input(z.object({
        productId: z.number(),
        name: z.string(),
        price: z.number().positive(),
        stock: z.number().positive(),
        description: z.string(),
        categoryId: z.number().positive(),
        fileWrapper: z.instanceof(FormData)
    }))
    .handler(async({
        input: {productId, name, price, stock, categoryId, description, fileWrapper},
        ctx: {user}
    }) => {
        // Extract product images from fileWrapper
        const productImages = fileWrapper.getAll("files") as File[];
       
        await updateProductUseCase({
            id: productId,
            name,
            price,
            stock,
            description,
            categoryId,
            productImages, // Pass productImages to the use case
        });

        revalidatePath("/admin/products")
    })
    

