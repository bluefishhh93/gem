import "@/app/globals.css";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { cn } from "@/lib/utils";
import React, { ReactNode, Suspense } from "react";
import { Archivo } from "next/font/google";
import { Libre_Franklin } from "next/font/google";
import { Providers } from "@/app/providers";
import { Toaster } from "@/components/ui/toaster";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import Sidebar from "./sidebar-blog";
import CreateBlogButton from "./create-draft-button";


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
                    "min-h-screen bg-background antialiased overflow-y-auto",
                    archivo.variable,
                    libre_franklin.variable
                )}
            >
                <Providers>
                    <NextTopLoader color="var(--loader-color)" showSpinner={false} />
                        <div className="flex h-screen">
                            <Sidebar />
                            <div className="flex-grow p-4">
                                {children}
                            </div>
                        </div>
                </Providers>
                <Toaster />
            </body>
        </html>
    );
}

