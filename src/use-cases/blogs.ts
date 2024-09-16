import { createBlog, deleteBlog, getBlogById, getBlogs, getBlogsByPublished, updateBlog } from "@/data-access/blogs";
import { Blog, NewBlog } from "@/db/schema";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";
import { validateImage } from "@/util/util";
import { validate } from "uuid";
import {sanitizeOptions} from  "@/lib/tiptap"
import sanitizeHtml from "sanitize-html";
export async function createBlogUseCase({
    title,
    content,
    image,
}: {
    title: string;
    content: string;
    image: File;
}) {
    validateImage(image);
    const { secure_url } = await uploadToCloudinary(image, {
        folder: 'blogs',
    })

    return createBlog({ title, content, imageUrl: secure_url });
}

export async function createDraftUseCase(
    {
        title,
        content,
        image,
    }: {
        title: string;
        content: string;
        image: File;
    }
) {

    validateImage(image);
    const { secure_url } = await uploadToCloudinary(image, {
        folder: 'blogs',
    })

    const newDraft = await createBlog({
        title, content, imageUrl: secure_url,
    });

    if (!newDraft) {
        throw new Error("Failed to create draft");
    }

    return newDraft;
}





export async function getBlogsUseCase() {
    const blogs = await getBlogs();
    return blogs;
}

export async function deleteBlogUseCase(id: number) {
    const blog = await getBlogById(id);
    if (!blog) {
        throw new Error("Blog not found");
    }
    if (blog.imageUrl) {
        await deleteFromCloudinary(blog.imageUrl);
    }
    return deleteBlog(id);
}

export async function updateBlogUseCase(id: number, {
    title,
    content,
    image,
    published,
}: {
    title?: string;
    content?: string;
    image?: File;
    published?: boolean;
}) {
    const blogData: Partial<Blog> = {};
    if (title) blogData.title = title;
    if (content) blogData.content = content;
    // if (content) blogData.content = sanitizeHtml(content, sanitizeOptions);
    if (image) {
        validateImage(image);
        const blog = await getBlogById(id);
        if (!blog) {
            throw new Error("Blog not found");
        }
        if (blog.imageUrl) {
            await deleteFromCloudinary(blog.imageUrl);
        }
        const { secure_url } = await uploadToCloudinary(image, {
            folder: 'blogs',
        })

        if (published !== undefined) {
            blogData.published = published;
        }

        blogData.updatedAt = new Date();
        blogData.imageUrl = secure_url;
    }
    return updateBlog(id, blogData);
}

export async function getBlogByIdUseCase(id: number) {
    const blog = await getBlogById(id);
    if (!blog) {
        throw new Error("Blog not found");
    }
    return blog;
}

export async function getBlogsByPublishedUseCase({ published }: { published: boolean }) {
    const blogs = await getBlogsByPublished(published);
    return blogs;
}

export async function updateBlogPublishedUseCase(id: number, published: boolean) {
    return updateBlog(id, { published });
}
