"use client";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import {
    MoreVertical,
    Trash,
    LinkIcon,
    FileCheck,
    FileText,
    ExternalLink
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";

enum Status {
    INACTIVE = "INACTIVE",
    ACTIVE = "ACTIVE",
    PENDING = "PENDING"
}
const DropdownMenuItemWithIcon = ({ icon: Icon, iconColor, text, onClick, className }: {
    icon: React.FC<any>;
    iconColor: string;
    text: string;
    onClick?: () => void;
    className?: string;
}) => (
    <DropdownMenuItem className={cn("flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800", className)} onClick={onClick}>
        <Icon className={`text-${iconColor}-500`} size={16} />
        <span className="text-gray-700 dark:text-gray-300">{text}</span>
    </DropdownMenuItem>
);
const copyArticleLink = (link: string) => {
    navigator.clipboard.writeText(link)
        .then(() => {
            alert('Article link copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy the link: ', err);
        });;
}

const BlogEntryDropdown = ({ isPublished, id }: { isPublished: boolean, id: string }) => (
    <DropdownMenu>
        <DropdownMenuTrigger>
            <MoreVertical className="cursor-pointer text-slate-500 hover:text-slate-700" size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44 rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
            {isPublished ? (
                <>
                    <DropdownMenuItemWithIcon
                        className="cursor-pointer"
                        icon={LinkIcon}
                        iconColor="blue"
                        text="Copy article link"
                        onClick={() => copyArticleLink(process.env.NEXT_PUBLIC_HOST_NAME + "/blog/" + id)}
                    />
                    <DropdownMenuItemWithIcon className="cursor-pointer" icon={ExternalLink} iconColor="green" text="View on blog" onClick={
                        () => window.open(`${process.env.NEXT_PUBLIC_HOST_NAME}/blog/${id}`, '_blank')
                    } />
                </>
            ) : (
                <>
                    {/* <DropdownMenuItemWithIcon icon={LinkIcon} iconColor="blue" text="Copy preview link" />
                    <DropdownMenuItemWithIcon icon={Eye} iconColor="green" text="Preview draft" /> */}
                </>
            )}
            <DropdownMenuItemWithIcon icon={Trash} iconColor="red" text="Delete" className="cursor-not-allowed" />
        </DropdownMenuContent>
    </DropdownMenu>
);

const truncateTitle = (title: string, maxLength: number = 17) => {
    if (title.length <= maxLength) return title;
    return `${title.slice(0, maxLength)} ...`;
};

const BlogEntry = ({ id, title, isPublished }: {
    id: string;
    title: string;
    isPublished: boolean;
    imageUrl: string;
    createdAt: Date;
}) => {
    const pathname = usePathname();
    const isActive = pathname.includes(id);

    return (
        <div
            className={cn(
                "flex items-center p-3 rounded-lg transition-colors duration-200 shadow-sm",
                "hover:bg-gray-100 dark:hover:bg-slate-800",
                isActive ? "bg-secondary-50 dark:bg-secondary-400 text-blue-800 dark:text-blue-100" : "text-gray-700 dark:text-gray-300"
            )}
        >
            <div className="flex items-center justify-between w-full space-x-4">
                <Link href={`/admin-blogs/${id}`} className="flex-grow">
                    <div className="flex items-center space-x-3 group">
                        {isPublished ? (
                            <FileCheck className="text-secondary-600 group-hover:text-secondary-800 transition-colors duration-200" size={20} />
                        ) : (
                            <FileText className="text-yellow-600 group-hover:text-yellow-800 transition-colors duration-200" size={20} />
                        )}
                        <span
                            className="flex-grow truncate font-medium text-gray-800 dark:text-gray-200 group-hover:text-secondary-600 dark:group-hover:text-secondary-300 transition-colors duration-200"
                            title={title}
                        >
                            {truncateTitle(title)}
                        </span>
                    </div>
                </Link>
                <BlogEntryDropdown isPublished={isPublished} id={id} />
            </div>
        </div>
    );
};

const BlogSection = ({ title, blogs }: {
    title: string;
    blogs: {
        id: number;
        title: string;
        content: string;
        published: boolean;
        imageUrl: string;
        createdAt: Date;
    }[];
}) => (
    <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
            <AccordionTrigger className="text-sm text-slate-500 hover:text-slate-700 hover:no-underline">
                {title}
            </AccordionTrigger>
            <AccordionContent>
                {blogs.map((blog) => (
                    <BlogEntry
                        key={blog.id}
                        id={blog.id.toString()}
                        title={blog.title}
                        isPublished={blog.published}
                        imageUrl={blog.imageUrl}
                        createdAt={blog.createdAt}
                    />
                ))}
            </AccordionContent>
        </AccordionItem>
    </Accordion>
);

interface Blog {
    id: number;
    title: string;
    content: string;
    published: boolean;
    imageUrl: string;
    createdAt: Date;
}

interface BlogSectionProps {
    blogs: Blog[];
}


export function SidebarBlogSection({ blogs }: BlogSectionProps) {
    const publishedBlogs = blogs.filter((blog) => blog.published === true);
    const draftBlogs = blogs.filter((blog) => blog.published !== true);

    return (
        <div>
            <BlogSection title="MY DRAFT" blogs={draftBlogs} />
            <BlogSection title="PUBLISHED" blogs={publishedBlogs} />
        </div>
    );
}
