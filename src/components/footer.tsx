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
    <footer className="bg-secondary-50 dark:bg-gray-800 py-6 md:py-12 w-full text-secondary-foreground dark:text-gray-200">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-start gap-4">
            <Link href="#" className="flex items-center gap-2" prefetch={false}>
                <Image width={100} height={100} src="/gem-removebg.png" alt="GEM" className="w-20 h-auto" />
            </Link>
            <p className={`${dancingScript.className} text-primary dark:text-secondary text-xl sm:text-2xl`}>Wear your stars.</p>
          </div>
          <div className="grid gap-2">
            <h3 className="font-semibold text-lg mb-2">Liên kết nhanh</h3>
            <Link href="#" className="text-sm hover:underline hover:text-primary dark:hover:text-secondary transition-colors duration-200" >
              Về chúng tôi
            </Link>
            <Link href="#" className="text-sm hover:underline hover:text-primary dark:hover:text-secondary transition-colors duration-200" >
              Liên Hệ
            </Link>
            <Link href="#" className="text-sm hover:underline hover:text-primary dark:hover:text-secondary transition-colors duration-200" >
              FAQ
            </Link>
            <Link href="#" className="text-sm hover:underline hover:text-primary dark:hover:text-secondary transition-colors duration-200" >
              Điều khoản
            </Link>
          </div>
          <div className="grid gap-2">
            <h3 className="font-semibold text-lg mb-2">Hỗ trợ</h3>
            <Link href="#" className="text-sm hover:underline hover:text-primary dark:hover:text-secondary transition-colors duration-200" >
              Trung tâm trợ giúp
            </Link>
            <Link href="#" className="text-sm hover:underline hover:text-primary dark:hover:text-secondary transition-colors duration-200" >
              Hoàn trả
            </Link>
            <Link href="#" className="text-sm hover:underline hover:text-primary dark:hover:text-secondary transition-colors duration-200" >
              Giao hàng
            </Link>
          </div>
          <div className="grid gap-2">
            <h3 className="font-semibold text-lg mb-2">Follow Us</h3>
            <div className="flex gap-4">
        
              <Link href="#" prefetch={false} className="hover:opacity-80 transition-opacity duration-200">
                <Image width={25} height={25} src="/facebook-icon.png" alt="Facebook" className="w-6 h-6 sm:w-8 sm:h-8" />
              </Link>
              <Link href="#" prefetch={false} className="hover:opacity-80 transition-opacity duration-200">
                <Image width={25} height={25} src="/zalo-icon.png" alt="Zalo" className="w-6 h-6 sm:w-8 sm:h-8" />
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-secondary-foreground dark:border-gray-600 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs">&copy; 2024 GEM. All rights reserved.</p>
          <p className="text-xs mt-4 sm:mt-0">Made with ❤️ by Bluefish93.</p>
        </div>
      </div>
    </footer>
  )
}
