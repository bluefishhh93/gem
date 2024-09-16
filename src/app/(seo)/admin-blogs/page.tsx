import { getBlogs, getLastEditedBlogId } from "@/data-access/blogs";
import { redirect } from "next/navigation";

export default async function BlogsPage() {
    const lastBlogId = await getLastEditedBlogId();

    if (lastBlogId) {
        redirect(`/admin-blogs/${lastBlogId}`)
    }

    return (
        <div>No blogs</div>
    )
}