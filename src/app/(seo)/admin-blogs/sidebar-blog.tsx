import ReusableSidebar from "./sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeftIcon, ArrowUpLeftIcon, ArrowUpLeftSquareIcon, FilePlus, Settings, User } from 'lucide-react';
import CreateDraftButton from './create-draft-button';
import { getCurrentUser } from '@/lib/session';
import { SidebarBlogSection } from "./sidebar-blog-section";
import { getBlogsUseCase } from "@/use-cases/blogs";
import Link from "next/link";
import Image from "next/image";

const BlogSidebar: React.FC = async () => {

  const blogs = await getBlogsUseCase();

  const header = (
    <Link href="/" className="mx-auto ">
      <Image src="/gem-removebg.png" alt="GEM" width={64} height={64} className="rounded-full" />
    </Link>
  );

  const content = (
    <>
      <CreateDraftButton />
      <SidebarBlogSection blogs={blogs} />
    </>
  );

  const footer = (
    <nav className="flex flex-col gap-2">
      {/* <Link href="/admin-blogs/dashboard" className="flex items-center py-3 px-4 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-slate-900 rounded-md">
        <Settings className="mr-3" size={18} /> Blog dashboard
      </Link> */}
      <Link href="/admin" className="flex items-center py-3 px-4 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-slate-900 rounded-md">
        <ArrowLeftIcon className="mr-3" size={18} /> Back to admin
      </Link>
    </nav>
  );

  return <ReusableSidebar header={header} content={content} footer={footer} />;
};

export default BlogSidebar;
