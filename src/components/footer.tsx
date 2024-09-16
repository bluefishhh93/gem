/**
 * v0 by Vercel.
 * @see https://v0.dev/t/vqD6unYv26l
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { MountainIcon } from "lucide-react"
import Link from "next/link"
import Image from 'next/image'
import { lusitana, dancingScript, amaticSC } from '@/util/fonts';

export default function Footer() {
  return (
    <footer className="bg-secondary-50 dark:bg-gray-800 py-4 md:py-6 w-full text-secondary-foreground dark:text-gray-200">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col items-start gap-3">
            <Link href="#" className="flex items-center gap-2 mx-auto" prefetch={false}>
              <Image width={80} height={80} src="/gem-removebg.png" alt="GEM" className="w-16 h-auto" />
            </Link>
            <p className={`${dancingScript.className} text-primary mx-auto dark:text-secondary text-lg sm:text-xl`}>Wear your stars.</p>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold text-base mb-1">Liên kết nhanh</h3>
            <Link href="#" className="text-xs hover:underline hover:text-primary dark:hover:text-secondary transition-colors duration-200">
              Về chúng tôi
            </Link>
            <Link href="#" className="text-xs hover:underline hover:text-primary dark:hover:text-secondary transition-colors duration-200">
              Liên Hệ
            </Link>
            <Link href="#" className="text-xs hover:underline hover:text-primary dark:hover:text-secondary transition-colors duration-200">
              FAQ
            </Link>
            <Link href="#" className="text-xs hover:underline hover:text-primary dark:hover:text-secondary transition-colors duration-200">
              Điều khoản
            </Link>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold text-base mb-1">Hỗ trợ</h3>
            <Link href="#" className="text-xs hover:underline hover:text-primary dark:hover:text-secondary transition-colors duration-200">
              Trung tâm trợ giúp
            </Link>
            <Link href="#" className="text-xs hover:underline hover:text-primary dark:hover:text-secondary transition-colors duration-200">
              Hoàn trả
            </Link>
            <Link href="#" className="text-xs hover:underline hover:text-primary dark:hover:text-secondary transition-colors duration-200">
              Giao hàng
            </Link>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold text-base mb-1">Follow Us</h3>
            <div className="flex gap-3">
              <Link href="#" prefetch={false} className="hover:opacity-80 transition-opacity duration-200">
                <Image width={20} height={20} src="/facebook-icon.png" alt="Facebook" className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
              <Link href="#" prefetch={false} className="hover:opacity-80 transition-opacity duration-200">
                <Image width={20} height={20} src="/zalo-icon.png" alt="Zalo" className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-secondary-foreground dark:border-gray-600 mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs">&copy; 2024 GEM. All rights reserved.</p>
          <p className="text-xs mt-4 sm:mt-0">Made with ❤️ by Bluefish93.</p>
        </div>
      </div>
    </footer>
  );
}

