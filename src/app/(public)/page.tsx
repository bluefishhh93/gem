import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { GemIcon, GiftIcon, HandIcon, HandshakeIcon, LeafIcon, SparkleIcon } from "lucide-react";
import { dancingScript, playfairDisplay } from "@/util/fonts";

export default async function Page() {
  return (
    <div className="">
      <section className="w-full ">
        <div className="container flex flex-col-reverse lg:grid lg:grid-cols-2 gap-6 px-4 md:px-6 lg:gap-10">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-center">
                Khám Phá Vòng Tay Cung Hoàng Đạo Của Bạn
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Vòng tay cung hoàng đạo - Món quà ý nghĩa, dành tặng cho những tâm hồn yêu thích sự tinh tế.
              </p>
            </div>
            <Link
              href="#"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              Mua Ngay
            </Link>
          </div>
          <div className="mb-6 lg:mb-0">
            <Image
              src="/gem-removebg.png"
              width="800"
              height="600"
              alt="Vòng Tay Cung Hoàng Đạo"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-contain object-center sm:w-full"
            />
          </div>
        </div>
      </section>
    </div>
  );

}
