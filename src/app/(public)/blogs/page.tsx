import Image from 'next/image';
import Link from 'next/link';
import { getBlogsByPublished } from "@/data-access/blogs";
import { createExcerpt, sanitizeBlogContent } from '@/app/util';

export default async function Page() {
  const blogs = await getBlogsByPublished(true);
  return (
    <div className="container mx-auto px-14 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <CardBlog key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  )
}

function CardBlog({ blog }: { blog: {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}}) {
  const sanitizedContent = sanitizeBlogContent(blog.content);
  const excerpt = createExcerpt(sanitizedContent);
  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}\nTh${month}`;
  };

  return (
    <Link href={`/blogs/${blog.id}`} className="block">
  <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform group">
    <div className="relative h-40 overflow-hidden">
      {/* Image */}
      <Image
        src={blog.imageUrl}
        alt={blog.title}
        layout="fill"
        objectFit="cover"
        className="transition-transform duration-300 ease-in-out group-hover:scale-110"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

      {/* Date and other details */}
      <div className="absolute top-2 left-2 bg-white bg-opacity-90 text-black p-1 rounded-md text-center leading-tight">
        <div className="text-lg font-bold">
          {formatDate(new Date(blog.createdAt)).split('\n')[0]}
        </div>
        <div className="text-xs font-semibold">
          {formatDate(new Date(blog.createdAt)).split('\n')[1]}
        </div>
      </div>
    </div>

    {/* Content */}
    <div className="p-3 bg-secondary-50 dark:bg-secondary-400">
      <h2 className="text-lg font-semibold mb-1 line-clamp-2">{blog.title}</h2>
      <p className="text-gray-600 mb-2 text-sm line-clamp-2">{excerpt}</p>
      <div className="flex justify-end items-center text-xs text-gray-500">
        <span>Đọc tiếp →</span>
      </div>
    </div>
  </div>
</Link>

  );
  
}