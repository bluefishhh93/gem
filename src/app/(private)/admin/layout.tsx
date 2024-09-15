// import "@/app/globals.css";
// import type { Metadata } from "next";
// import NextTopLoader from "nextjs-toploader";
// import { cn } from "@/lib/utils";
// import { ReactNode, Suspense } from "react";

// import { Archivo } from "next/font/google";
// import { Libre_Franklin } from "next/font/google";
// import { Providers } from "@/app/providers";
// import { Toaster } from "@/components/ui/toaster";
// import { Header, HeaderActions } from "@/app/(public)/_header/header";
// import { AdminSidebar } from "./components/side-bar";
// import { getCurrentUser } from "@/lib/session";
// import { redirect } from "next/navigation";
// import { HeaderActionsFallback } from "@/app/(public)/_header/header-actions-fallback";

// const archivo = Archivo({
//     subsets: ["latin"],
//     display: "swap",
//     variable: "--font-archivo",
// });
// const libre_franklin = Libre_Franklin({
//     subsets: ["latin"],
//     display: "swap",
//     variable: "--font-libre_franklin",
// });

// export const metadata: Metadata = {
//     title: "WDC Template",
//     icons: [
//         { rel: "icon", type: "image/png", sizes: "48x48", url: "/favicon.ico" },
//     ],
//     keywords: "yolo",
//     description: "A simple next.js template including drizzle and lucia auth",
// };

// export default async function RootLayout({
//     children,
// }: Readonly<{
//     children: ReactNode;
// }>) {
//     const user = await getCurrentUser();
//     if (!user || user.role !== "admin") {
//         redirect("/");
//     }
//     return (
//         <html lang="en" suppressHydrationWarning>
//             <body
//                 className={cn(
//                     "min-h-screen bg-background text-foreground antialiased",
//                     archivo.variable + " " + libre_franklin.variable,
//                 )}
//             >
//                 <Providers> 
//                     <NextTopLoader />
//                     <div className="flex">
//                         <AdminSidebar />
//                         <main className="flex-1 p-8">
//                             <div className="flex justify-between items-center mb-6">
//                                 <h1 className="text-3xl font-bold text-gray-800">Welcome back</h1>
//                                 <div className="flex items-center space-x-4">
//                                     <Suspense fallback={<HeaderActionsFallback />}>
//                                         <HeaderActions />
//                                     </Suspense>
//                                 </div>
//                             </div>
//                             {children}
//                         </main>
//                     </div>
//                 </Providers>
//                 <Toaster />
//             </body>
//         </html>
//     );
// }
import "@/app/globals.css";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { cn } from "@/lib/utils";
import React, { ReactNode, Suspense } from "react";
import { Archivo } from "next/font/google";
import { Libre_Franklin } from "next/font/google";
import { Providers } from "@/app/providers";
import { Toaster } from "@/components/ui/toaster";
import { HeaderActions } from "@/app/(public)/_header/header";
import { AdminSidebar } from "./components/side-bar";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { HeaderActionsFallback } from "@/app/(public)/_header/header-actions-fallback";
import { ModeToggle } from "@/components/mode-toggle";
import Image from "next/image";
import Link from "next/link";


const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
});
const libre_franklin = Libre_Franklin({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-libre_franklin",
});

export const metadata: Metadata = {
  title: "Gem",
  icons: [
    { rel: "icon", type: "image/png", sizes: "48x48", url: "/favicon.ico" },
  ],
  keywords: "yolo",
  description: "A simple next.js template including drizzle and lucia auth",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    redirect("/");
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          archivo.variable,
          libre_franklin.variable
        )}
      >
        <Providers>
          <NextTopLoader color="var(--loader-color)" showSpinner={false} />
          <div className="flex h-screen overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center py-6">
                    <Link href="/" className="flex items-center space-x-2 cursor-pointer">
                      <Image
                        src="/gem-removebg.png"
                        alt="GEM Logo"
                        width={40}
                        height={40}
                      />
                      <h1 className="text-3xl font-bold text-secondary-400 dark:text-secondary-100">
                        GEM
                      </h1>
                    </Link>
                    <div className="flex items-center space-x-2">
                      {/* <ModeToggle />                     */}
                      <Suspense fallback={<HeaderActionsFallback />}>
                        <HeaderActions />
                      </Suspense>
                    </div>
                  </div>
                </div>
              </header>
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
                <div className="container mx-auto px-6 py-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
