// app/blogs/[blogId]/draft/page.tsx
import { DraftBlogForm } from "../draft-blog-form";
import { notFound, redirect } from "next/navigation";
import PreviewButton from "../preview-button";
import PublicButton from "../public-button";
import { ClockArrowUp, Timer } from "lucide-react";
import { getBlogByIdUseCase } from "@/use-cases/blogs";
import { getCurrentUser } from "@/lib/session";

enum Status {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    PENDING = 'PENDING',
}

export default async function DraftPage({ params }: { params: { blogId: string } }) {
    const { blogId } = params;
    const user = await getCurrentUser();

    const post = await getBlogByIdUseCase(parseInt(blogId));

    if (!post) {
        notFound();
    }

    return (
        <>
            <div className="flex items-center justify-between mb-4">


                <div className="flex space-x-4">
                    <PreviewButton blog={post} />
                    {

                        <PublicButton blogId={parseInt(blogId)} initialPublishedState={post.published} />

                    }
                </div>
            </div>

            <div className="">
                <DraftBlogForm content={post.content} id={blogId} blogTitle={post.title} isAdminOrAuthor={user?.role === 'admin'} />
            </div>

        </>
    );
}