// BlogPost.tsx
import { BlogContentRenderer } from './BlogContentRenderer';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { BookOpen } from 'lucide-react';
import Image from 'next/image';

interface Blog {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string;
  published: boolean;
}

interface BlogPostProps {
  blog: Blog;
}

export function BlogPost({ blog }: BlogPostProps) {
  const readingTime = calculateReadingTime(blog.content);

  return (
    <article className="max-w-4xl mx-auto px-6">
      <BlogInfo 
        title={blog.title}
        postDate={blog.createdAt.toISOString()} 
        readingTime={readingTime} 
        imageUrl={blog.imageUrl} 
      />
      <section className="mt-8">
        <BlogContentRenderer content={blog.content} />
      </section>
    </article>
  );
}

function BlogInfo({ title, postDate, readingTime, imageUrl }: { title: string; postDate: string; readingTime: number, imageUrl: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 mb-6 space-y-4">
      <h1 className="text-4xl font-extrabold leading-tight mb-6 text-gray-900 dark:text-gray-100">
        {title}
      </h1>
      <div className="flex items-center space-x-2 text-md text-gray-600 dark:text-gray-400">
        <p>
          {new Date(postDate).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <span className="text-gray-400 dark:text-gray-600">•</span>
        <span className="flex items-center">
          <BookOpen className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-1" />
          {readingTime} phút đọc
        </span>
      </div>
      <div className="w-full max-w-4xl aspect-[16/9] relative">
        <Image 
          src={imageUrl} 
          alt="Blog Image" 
          fill
          className="object-cover rounded-lg"
        />
      </div>
    </div>
  );
}

function calculateReadingTime(content: string) {
  const plainText = content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const wordsPerMinute = 200; // Average reading speed
  const words = plainText.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
