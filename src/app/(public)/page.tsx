'use client'
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { GemIcon, GiftIcon, HandIcon, HandshakeIcon, LeafIcon, SparkleIcon } from "lucide-react";
import { dancingScript, playfairDisplay } from "@/util/fonts";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const zodiacSigns = [
  { name: 'Aries', vietnameseName: 'Bạch Dương' },
  { name: 'Taurus', vietnameseName: 'Kim Ngưu' },
  { name: 'Gemini', vietnameseName: 'Song Tử' },
  { name: 'Cancer', vietnameseName: 'Cự Giải' },
];

export default function Page() {
  return (
    <div className="bg-gradient-to-b from-background to-secondary/20">
      <section className="w-full mb-6 py-12 md:py-24">
        <div className="container flex flex-col-reverse lg:grid lg:grid-cols-2 gap-6 px-4 md:px-6 lg:gap-10 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center space-y-6"
          >
            <div className="space-y-4">
              <h1 className="text-4xl font-sans tracking-tighter sm:text-6xl xl:text-7xl/none text-center lg:text-left bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Khám Phá Vòng Tay Cung Hoàng Đạo Của Bạn
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl text-center lg:text-left">
                Vòng tay cung hoàng đạo - Món quà ý nghĩa, dành tặng cho những tâm hồn yêu thích sự tinh tế.
              </p>
            </div>
            <Button size="lg" className="w-full sm:w-auto">
              Mua Ngay
            </Button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 lg:mb-0"
          >
            <Image
              src="/gem-removebg.png"
              width="800"
              height="600"
              alt="Vòng Tay Cung Hoàng Đạo"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-contain object-center sm:w-full drop-shadow-xl"
            />
          </motion.div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h2 className={`text-4xl font-sans tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary`}>
                Khám Phá Các Thiết Kế Vòng Tay Cung Hoàng Đạo
              </h2>
              <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl">
                Mỗi chiếc vòng tay cung hoàng đạo đều được chế tác tỉ mỉ với các vật liệu cao cấp, phản ánh những đặc điểm độc đáo của cung chiêm tinh của bạn.
              </p>
            </motion.div>
            <div className="grid gap-6 sm:grid-cols-2">
              {zodiacSigns.map((zodiac, index) => (
                <motion.div 
                  key={zodiac.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl"
                >
                  <Image
                    src={`/products/${zodiac.name.toLowerCase()}.webp`}
                    width={300}
                    height={300}
                    alt={`Vòng Tay ${zodiac.vietnameseName}`}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex flex-col justify-end">
                    <h3 className="text-lg font-semibold text-white">{zodiac.vietnameseName}</h3>
                    <p className="text-sm text-white/80 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Khám phá vòng tay {zodiac.vietnameseName} độc đáo của chúng tôi
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-secondary/20">
        <div className="container px-4 md:px-6">
          <h2 className={`text-3xl font-sans tracking-tighter sm:text-4xl md:text-5xl mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary`}>
            Được Chế Tác Tỉ Mỉ
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: GemIcon, title: 'Đá Quý Chính Hãng', description: 'Mỗi chiếc vòng tay đều sử dụng các chất liệu bền bỉ.' },
              { icon: HandshakeIcon, title: 'Thiết Kế Tùy Chỉnh', description: 'Chúng tôi cung cấp các tùy chọn thiết kế tùy chỉnh để đảm bảo vòng tay của bạn thật sự đặc biệt.' },
              { icon: HandIcon, title: 'Làm Thủ Công', description: 'Mỗi chiếc vòng tay đều được làm thủ công với sự chú ý tỉ mỉ đến từng chi tiết.' },
              { icon: SparkleIcon, title: 'Hoàn Thiện Tỉ Mỉ', description: 'Các chi tiết hoàn thiện của vòng tay được chăm chút tỉ mỉ, đảm bảo vẻ đẹp và sự bền vững.' },
            ].map(({ icon: Icon, title, description }, index) => (
              <motion.div 
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <Icon className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container px-4 md:px-6">
          <h2 className={`${playfairDisplay.className} text-3xl font-sans tracking-tighter sm:text-4xl md:text-5xl mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary`}>
            Nhận xét của khách hàng
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'Sarah M.', zodiac: 'Kim Ngưu', avatar: '/customers/customer1.png', title: 'Tôi thực sự yêu chiếc vòng tay của mình!', content: 'Sự khéo léo và sự chú ý đến từng chi tiết trên chiếc vòng tay của tôi cung Kim Ngưu thật sự tuyệt vời. Đây đã trở thành phụ kiện yêu thích của tôi và tôi thường nhận được những lời khen ngợi về nó.' },
              { name: 'Alex T.', zodiac: 'Song Tử', avatar: '/customers/customer2.png', title: 'Đẹp và Độc Đáo', content: 'Tôi rất ấn tượng với chất lượng và sự khéo léo của chiếc vòng tay cung Song Tử của mình. Đây là sự pha trộn hoàn hảo giữa phong cách và tính cách, giống như dấu hiệu của tôi.' },
              { name: 'Jamie L.', zodiac: 'Bạch Dương', avatar: '/customers/customer3.png', title: 'Vượt quá mong đợi của tôi', content: 'Ban đầu tôi có chút do dự, nhưng chiếc vòng tay cung Bạch Dương tôi nhận được thật sự rất đẹp. Chất lượng và sự khéo léo là hàng đầu, và tôi thích cách nó phù hợp với tính cách của tôi.' },
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="flex flex-col justify-between h-full">
                  <CardHeader>
                    <CardTitle>{testimonial.title}</CardTitle>
                    <CardDescription>{testimonial.content}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <div className="flex items-center space-x-4">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <div className="font-medium">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">Chủ sở hữu vòng tay cung {testimonial.zodiac}</div>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}