import { blogs, NewBlog, Blog } from "@/db/schema";
import { database } from "@/db";
import { and, desc, eq } from "drizzle-orm";

export async function createBlog(blog: NewBlog) {
    const [newBlog] = await database.insert(blogs).values(blog).returning();
    return newBlog;
}

export async function getBlogs() {
    const newBlogs = await database.select().from(blogs);
    return newBlogs;
}

export async function getBlogById(id: number) {
    return await database.query.blogs.findFirst({
        where: eq(blogs.id, id),
    });
}

export async function updateBlog(id: number, blog: Partial<Blog>) {
    const [updatedBlog] = await database.update(blogs).set(blog).where(eq(blogs.id, id)).returning();
    return updatedBlog;
}

export async function deleteBlog(id: number) {
    await database.delete(blogs).where(eq(blogs.id, id));
}


export async function getLastEditedBlogId() {
    const [lastEditedBlog] = await database.select({ id: blogs.id }).from(blogs).orderBy(desc(blogs.createdAt)).limit(1);
    return lastEditedBlog?.id ?? null;
}

export async function getBlogsByPublished(published: boolean) {
    const blogList = await database.select().from(blogs).where(eq(blogs.published, published));
    return blogList;
}

