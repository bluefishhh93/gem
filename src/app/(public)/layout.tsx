import "@/app/globals.css";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

import { Archivo, Playfair_Display } from "next/font/google";
import { Libre_Franklin } from "next/font/google";
import { Providers } from "../providers";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "./_header/header";
import Footer from "@/components/footer";
import { FloatingContactButtons } from "@/components/contact-button";
import  StarryBackground  from "@/components/starry-background";

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

const playfair_display = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair_display",
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
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          archivo.variable,
          libre_franklin.variable,
          playfair_display.variable
        )}
      >
        <Providers>
          <NextTopLoader color="var(--loader-color)" showSpinner={false} />
          <Header />
          <main className="flex-grow relative z-10">{children}</main>
          <StarryBackground />
          <Footer />
          <FloatingContactButtons />
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
