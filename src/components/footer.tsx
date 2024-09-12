/**
 * v0 by Vercel.
 * @see https://v0.dev/t/vqD6unYv26l
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { MountainIcon } from "lucide-react"
import Link from "next/link"
import Image from 'next/image'
import { lusitana, dancingScript, amaticSC } from '@/util/fonts';

export default function Component() {
  return (
    <footer className="bg-muted py-6 md:py-12 w-full">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-start gap-4">
            <Link href="#" className="flex items-center gap-2" prefetch={false}>
                {/* <MountainIcon className="h-6 w-6" /> */}
                <Image width={100} height={100} src="/icons/gem-removebg.png" alt="GEM" />
            </Link>
            <p className={`${dancingScript.className} text-muted-foreground text-2xl text-pink-400`}>Wear your stars.</p>
          </div>
          <div className="grid gap-2">
            <h3 className="font-semibold">Liên kết nhanh</h3>
            <Link href="#" className="text-sm hover:underline" >
              Về chúng tôi
            </Link>
            <Link href="#" className="text-sm hover:underline" >
              Liên Hệ
            </Link>
            <Link href="#" className="text-sm hover:underline" >
              FAQ
            </Link>
            <Link href="#" className="text-sm hover:underline" >
              Điều khoản
            </Link>
          </div>
          <div className="grid gap-2">
            <h3 className="font-semibold">Hỗ trợ</h3>
            <Link href="#" className="text-sm hover:underline" >
              Trung tâm trợ giúp
            </Link>
            <Link href="#" className="text-sm hover:underline" >
              Hoàn trả
            </Link>
            <Link href="#" className="text-sm hover:underline" >
              Giao hàng
            </Link>
          </div>
          <div className="grid gap-2">
            <h3 className="font-semibold">Follow Us</h3>
            <div className="flex gap-4">
              <Link href="#" prefetch={false}>
                <Image width={25} height={25} src="/icons/ig-icon.png" alt="Instagram" />
              </Link>
              <Link href="#" prefetch={false}>
                <Image width={25} height={25} src="/icons/facebook-icon.png" alt="Facebook" />
              </Link>
              <Link href="#" prefetch={false}>
                <Image width={25} height={25} src="/icons/zalo-icon.png" alt="Zalo" />
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-muted-foreground mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-muted-foreground">&copy; 2024 GEM. All rights reserved.</p>
          <p className="text-xs text-muted-foreground mt-4 sm:mt-0">Made with ❤️ by Bluefish93.</p>
        </div>
      </div>
    </footer>
  )
}
