"use server";
import { adminOnlyAction } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { createBlogUseCase, updateBlogPublishedUseCase, updateBlogUseCase } from "@/use-cases/blogs";


export const createBlogAction = adminOnlyAction
    .createServerAction()
    .input(
        z.object({
            title: z.string(),
            content: z.string(),
            image: z.instanceof(FormData),
        })
    )
    .handler(async ({ input, ctx }) => {
        const image = input.image.get("file") as File;
        if (!image || !(image instanceof File)) {
            throw new Error("Invalid file");
        }
        
        const newDraft = await createBlogUseCase({
            title: input.title,
            content: input.content,
            // content: sanitizeHtml(input.content),
            image
        });
        
        revalidatePath(`/blogs/${newDraft.id}`);
        return { id: newDraft.id };
    });


    export const updateBlogAction = adminOnlyAction
    .createServerAction()
    .input(
        z.object({
            id: z.number(),
            title: z.string().optional(),
            content: z.string().optional(),
            image: z.instanceof(FormData).optional(),
            published: z.boolean().optional(),
        })
    )
    .handler(async ({ input, ctx }) => {
       
        const updateData : {
            id: number;
            title?: string;
            content?: string;
            image?: File;
            published?: boolean;
        } = {
            id: input.id,
        }

        if (input.title) {
            updateData.title = input.title;
        }

        if (input.content) {
            // updateData.content = sanitizeHtml(input.content);
            updateData.content = input.content;
        }

        if (input.image) {
            const image = input.image.get("file") as File;
            if (!image || !(image instanceof File)) {
                throw new Error("Invalid file");
            }
            updateData.image = image;
        }

        if (input.published !== undefined) {
            updateData.published = input.published;
        }

        const updatedBlog = await updateBlogUseCase(input.id, updateData);

        revalidatePath(`/admin-blogs/${updatedBlog.id}`);
        return { id: updatedBlog.id };
    })
    

    export const publishBlogAction = adminOnlyAction
    .createServerAction()
    .input(
        z.object({
            id: z.number(),
        })
    )
    .handler(async ({ input, ctx }) => {
        const updatedBlog = await updateBlogPublishedUseCase(input.id, true);
        revalidatePath(`/admin-blogs/${updatedBlog.id}`);
        return { id: updatedBlog.id };
    })


    export const unpublishBlogAction = adminOnlyAction
    .createServerAction()
    .input(
        z.object({
            id: z.number(),
        })
    )
    .handler(async ({ input, ctx }) => {
        const updatedBlog = await updateBlogPublishedUseCase(input.id, false);
        revalidatePath(`/admin-blogs/${updatedBlog.id}`);
        return { id: updatedBlog.id };
    })