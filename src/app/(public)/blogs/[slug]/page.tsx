// pages/blog/[id].tsx
import { NotFoundError } from "@/app/util";
import { Suspense } from "react";
import BlogLoading from "./loading";
import { getCurrentUser } from "@/lib/session";
import { getBlogByIdUseCase } from "@/use-cases/blogs";
import { BlogPost } from "../BlogPost";
export const fetchCache = 'force-no-store';

export default async function BlogPage({ params }: { params: { slug : string } }) {

    const { slug } = params;

    const blog = await getBlogByIdUseCase(Number(slug));


    if (!blog || !blog.published) {
        throw new NotFoundError("Blog not found");
    }

    return (
        <Suspense fallback={<BlogLoading />}>
            <BlogPost
                blog={blog}
            />
        </Suspense>
    );
}