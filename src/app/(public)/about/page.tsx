'use client'
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import { motion } from 'framer-motion';
import { playfairDisplay, roboto, dancingScript, inter } from '@/util/fonts';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const Component: FC = () => {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-gradient-to-b from-background to-secondary/20">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <motion.div className="flex flex-col justify-center space-y-4" {...fadeInUp}>
                <div className="space-y-2">
                  <h1 className={`${playfairDisplay.className} text-3xl text-primary font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary`}>
                    Wear Your Stars
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Hãy khám phá món phụ kiện hoàn hảo tôn vinh cá tính riêng
                    biệt trong chiêm tinh học của bạn. Các vòng tay cung hoàng
                    đạo thủ công của chúng tôi kết hợp nét thanh lịch vượt thời
                    gian với ý nghĩa cá nhân sâu sắc.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="#"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Bộ sưu tập
                  </Link>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src="/banner-2.png"
                  width="550"
                  height="550"
                  alt="Hero"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square shadow-lg"
                />
              </motion.div>
            </div>
          </div>
        </section>
        
        <section className="w-full bg-gradient-to-b from-secondary/20 to-background py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <motion.div 
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <h2 className={`${playfairDisplay.className} text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary`}>
                  Về chúng tôi
                </h2>
                <p className={`${roboto.className} max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed`}>
                  Chúng tôi được thành lập bởi một nhóm nhà thiết kế đam mê và
                  những người yêu thích chiêm tinh, nhằm tạo ra một cách độc đáo
                  để mọi người kết nối với bản sắc vũ trụ của họ. Qua bộ sưu tập
                  được lựa chọn kỹ lưỡng của chúng tôi, chúng tôi mời bạn hòa
                  mình vào một cuộc hành trình tự khám phá và thể hiện bản thân.
                </p>
              </div>
            </motion.div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src="/banner-1.png"
                  width="550"
                  height="310"
                  alt="Our Story"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last shadow-lg"
                />
              </motion.div>
              <motion.div 
                className="flex flex-col justify-center space-y-4"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className={`${roboto.className} text-muted-foreground`}>
                  Thành lập vào năm 2024, GEM với mục tiêu trở thành thương hiệu
                  hàng đầu về những chiếc vòng tay tinh tế và ý nghĩa, được yêu
                  thích vì vẻ đẹp vượt thời gian, kết nối với vũ trụ và tác động
                  tích cực đến cuộc sống của khách hàng và cộng đồng.
                </p>
                <p className={`${roboto.className} text-muted-foreground`}>
                  Chúng tôi tin rằng cung hoàng đạo nắm giữ chìa khóa khám phá
                  bản thân, và mong muốn tôn vinh điều này qua các thiết kế của
                  mình. Mỗi chiếc vòng tay đều mang năng lượng và biểu tượng độc
                  đáo của cung hoàng đạo, giúp khách hàng thể hiện cá tính và
                  kết nối với vũ trụ.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-secondary/20">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className={`${playfairDisplay.className} text-3xl font-bold tracking-tighter md:text-4xl/tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary`}>
                Chế tác và nguyên liệu
              </h2>
              <p className={`${roboto.className} max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed`}>
                Tại GEM, chúng tôi tin rằng sự sang trọng thực sự nằm ở chất
                lượng của nguyên liệu và sự tỉ mỉ trong quá trình chế tác. Mỗi
                chiếc vòng tay đều được chế tác thủ công một cách tỉ mỉ từ những
                nguyên liệu bền bỉ và an toàn, đảm bảo độ bền lâu dài và vẻ đẹp
                vượt thời gian.
              </p>
            </motion.div>
            <motion.div 
              className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-end"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src="/banner-5.png"
                width="550"
                height="310"
                alt="Craftsmanship"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last shadow-lg"
              />
            </motion.div>
          </div>
        </section>

        <section className="w-full bg-gradient-to-b from-secondary/20 to-background py-12 md:py-24 lg:py-32">
          <div className="container grid gap-6 px-4 md:grid-cols-2 md:px-6 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src="/banner-4.png"
                width="800"
                height="600"
                alt="Design Process"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full shadow-lg"
              />
            </motion.div>
            <motion.div 
              className="flex flex-col justify-center space-y-4"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <h2 className={`${playfairDisplay.className} text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary`}>
                  Sứ mệnh
                </h2>
                <p className={`${roboto.className} text-muted-foreground md:text-xl`}>
                  Sứ mệnh của chúng tôi là truyền cảm hứng cho mọi người chấp
                  nhận bản sắc chiêm tinh của mình, tôn vinh những điểm mạnh,
                  đức tính và vẻ đẹp nội tại của họ. Chúng tôi mong muốn tạo ra
                  những thiết kế độc đáo, phản ánh câu chuyện và giá trị cá nhân
                  của khách hàng.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-secondary/20">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <motion.div 
              className="flex flex-col gap-2 min-[400px]:flex-row lg:order-last lg:justify-end"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src="/banner-3.png"
                width="550"
                height="310"
                alt="Zodiac Meaning"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last shadow-lg"
              />
            </motion.div>
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className={`${playfairDisplay.className} text-3xl font-bold tracking-tighter md:text-4xl/tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary`}>
                Ý nghĩa đằng sau cung hoàng đạo
              </h2>
              <p className={`${roboto.className} max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed`}>
                Mỗi chòm sao đem lại một nguồn năng lượng và biểu tượng độc đáo,
                phản ánh những nét tính cách và đặc điểm khác biệt của khách
                hàng chúng tôi. Những thiết kế của chúng tôi được lấy cảm hứng
                từ những nguyên mẫu thiên thể này, cho phép bạn đeo một món
                trang sức gần gũi với bản sắc chiêm tinh của bạn và kết nối bạn
                với vũ trụ bao la.
              </p>
            </motion.div>
          </div>
        </section>

        <ContactUs />
      </main>
    </div>
  );
};

export default Component;



const ContactUs = () => {
  return (
    <section className="bg-gradient-to-b from-background to-secondary/20 py-16">
      <div className="container mx-auto px-6 lg:px-20">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className={`${playfairDisplay.className} text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary`}>
            Liên Hệ
          </h2>
          <p className={`${roboto.className} mt-4 text-muted-foreground`}>
            Chúng tôi luôn sẵn sàng lắng nghe ý kiến và giải đáp thắc mắc của bạn.
          </p>
        </motion.div>
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <motion.div 
            className="lg:w-1/2 lg:pr-10 mb-10 lg:mb-0"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={"/contact.webp"}
              alt="Contact Us"
              className="rounded-lg shadow-lg"
              width={500}
              height={330}
            />
          </motion.div>
          <motion.div 
            className="lg:w-1/2 lg:pl-10"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form className="bg-card p-8 rounded-lg shadow-lg">
              <div className="mb-6">
                <label htmlFor="name" className="block text-foreground font-medium mb-2">Họ và tên</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nhập họ và tên của bạn"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block text-foreground font-medium mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nhập email của bạn"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-foreground font-medium mb-2">Tin nhắn</label>
                <textarea
                  id="message"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                  placeholder="Nhập tin nhắn của bạn"
                ></textarea>
              </div>
              <motion.button
                type="submit"
                className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Gửi Tin Nhắn
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

