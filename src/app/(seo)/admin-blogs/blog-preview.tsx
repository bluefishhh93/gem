import React, { useState } from 'react';
import { X, Monitor, Smartphone, BookOpen, NotepadText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Footer from '@/components/footer';
import Image from 'next/image';
import { calculateReadingTime } from '@/app/util';
import Link from 'next/link';
import { dancingScript } from '@/util/fonts';

type PreviewMode = 'desktop' | 'mobile';

interface BlogPreviewOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    title: string;
    content: string;
    createdAt: Date;
    imageUrl: string;
  };
}

const BlogPreviewOverlay: React.FC<BlogPreviewOverlayProps> = ({ isOpen, onClose, post }) => {
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const readingTime = calculateReadingTime(post.content);

  const PhoneFrame = ({ children }: { children: React.ReactNode }) => (
    <div className="relative my-6 mx-auto" style={{ width: '375px', height: '812px' }}>
      <Image width={375} height={812} src="/phone-frame.png" alt="Phone frame" className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 overflow-y-auto p-6" style={{ top: '60px', bottom: '60px' }}>
        {children}
      </div>
    </div>
  );

  const MonitorFrame = ({ children }: { children: React.ReactNode }) => (
    <div className="relative my-6 mx-auto" style={{ width: '1024px', height: '640px' }}>
      <Image width={1024} height={640} src="/monitor-frame.png" alt="Monitor frame" className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 overflow-y-auto p-6" style={{ top: '48px', bottom: '128px', left: '32px', right: '32px' }}>
        {children}
      </div>
    </div>
  );

  const Content = () => (
    <article className="bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <header className="mb-8 text-center">
          <h1 className={`${previewMode === 'mobile' ? 'text-xl sm:text-2xl' : 'text-xl sm:text-2xl md:text-3xl'} font-extrabold leading-tight mb-4 text-gray-900 dark:text-gray-100`}>
            {post.title}
          </h1>
          <div className={`flex ${previewMode === 'mobile' ? 'flex-col' : 'flex-row'} items-center justify-center text-gray-500 dark:text-gray-400 mb-6 ${previewMode === 'mobile' ? 'space-y-4' : 'space-x-4'}`}>
            <div className="flex items-center space-x-2">
              <p className={`${previewMode === 'mobile' ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400`}>
                {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <span className={`${previewMode === 'mobile' ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400 flex items-center`}>
                <BookOpen className={`${previewMode === 'mobile' ? 'w-3 h-3' : 'w-4 h-4'} text-gray-500 dark:text-gray-400 mr-1`} />
                {readingTime} min read
              </span>
            </div>
          </div>
          <Separator />
        </header>
        <section className="blog-content mt-6">
          <div
            className={`prose dark:prose-invert max-w-none ${previewMode === 'mobile' ? 'text-sm' : 'text-base'}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </section>
        <footer className="mt-8">
          {/* Conditionally render MobileFooter or regular Footer based on previewMode */}
          {previewMode === 'mobile' ? <MobileFooter /> : <Footer />}
        </footer>
      </div>
    </article>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-screen h-screen max-w-full max-h-full m-0 p-0">
        <DialogHeader className="absolute top-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 flex justify-between items-center z-10">
          <div className='flex justify-between w-full px-20'>
            <DialogTitle className="text-lg sm:text-xl md:text-2xl">
              <div className='flex items-center text-slate-600 text-xl dark:text-slate-400'>
                <NotepadText className="mr-2 h-4 w-4 sm:h-8 sm:w-8" />
                <span>Preview Draft</span>
              </div>
            </DialogTitle>
            <Button className='px-6 text-blue-500 font-bold rounded-full border border-blue-600 hover:bg-blue-50 hover:text-blue-500' variant="ghost" size="default" onClick={onClose}>
              Close
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={previewMode === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('desktop')}
            >
              <Monitor className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Desktop
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('mobile')}
            >
              <Smartphone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Mobile
            </Button>
          </div>
        </DialogHeader>
        <div className="mt-16 p-4 sm:p-6 h-full overflow-auto flex justify-center items-start">
          {previewMode === 'mobile' ? (
            <PhoneFrame>
              <Content />
            </PhoneFrame>
          ) : (
            <MonitorFrame>
              <Content />
            </MonitorFrame>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};


const MobileFooter = () => {
  return (
    <footer className="bg-secondary-50 dark:bg-gray-800 py-6 w-full text-secondary-foreground dark:text-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-8">
          {/* Logo and Slogan */}
          <div className="flex flex-col items-start gap-4 items-center">
            <Link href="#" className="flex items-center gap-2" prefetch={false}>
              <Image width={80} height={80} src="/gem-removebg.png" alt="GEM" className="w-16 h-auto" />
            </Link>
            <p className={`${dancingScript.className} text-primary dark:text-secondary text-lg`}>Wear your stars.</p>
          </div>

          {/* Quick Links */}
          <div className="grid gap-2">
            <h3 className="font-semibold text-base mb-2">Liên kết nhanh</h3>
            <Link href="#" className="text-sm hover:underline hover:text-primary dark:hover:text-secondary transition-colors duration-200">
              Về chúng tôi
            </Link>
            <Link href="#" className="text-sm hover:underline hover:text-primary dark:hover:text-secondary transition-colors duration-200">
              Liên Hệ
            </Link>
            <Link href="#" className="text-sm hover:underline hover:text-primary dark:hover:text-secondary transition-colors duration-200">
              FAQ
            </Link>
            <Link href="#" className="text-sm hover:underline hover:text-primary dark:hover:text-secondary transition-colors duration-200">
              Điều khoản
            </Link>
          </div>

          {/* Support Links */}
          <div className="grid gap-2">
            <h3 className="font-semibold text-base mb-2">Hỗ trợ</h3>
            <Link href="#" className="text-sm hover:underline hover:text-primary dark:hover:text-secondary transition-colors duration-200">
              Trung tâm trợ giúp
            </Link>
            <Link href="#" className="text-sm hover:underline hover:text-primary dark:hover:text-secondary transition-colors duration-200">
              Hoàn trả
            </Link>
            <Link href="#" className="text-sm hover:underline hover:text-primary dark:hover:text-secondary transition-colors duration-200">
              Giao hàng
            </Link>
          </div>

          {/* Social Media Links */}
          <div className="grid gap-2">
            <h3 className="font-semibold text-base mb-2">Theo dõi</h3>
            <div className="flex gap-4">
              <Link href="#" prefetch={false} className="hover:opacity-80 transition-opacity duration-200">
                <Image width={20} height={20} src="/facebook-icon.png" alt="Facebook" className="w-5 h-5" />
              </Link>
              <Link href="#" prefetch={false} className="hover:opacity-80 transition-opacity duration-200">
                <Image width={20} height={20} src="/zalo-icon.png" alt="Zalo" className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-secondary-foreground dark:border-gray-600 mt-6 pt-4 flex flex-col items-center">
          <p className="text-xs text-center">&copy; 2024 GEM. All rights reserved.</p>
          <p className="text-xs mt-2 text-center">Made with ❤️ by Bluefish93.</p>
        </div>
      </div>
    </footer>
  );
}

export default BlogPreviewOverlay;