"use client";

import { Button } from "@/components/ui/button";
import useMediaQuery from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { BookIcon, SearchIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const HeaderButton = ({ href, label, isActive }: { href: string, label: string, isActive: boolean }) => {
  return (
    <Button
      variant={"ghost"}
      asChild
      className={cn(
        "flex items-center justify-center gap-2 text-md hover:text-secondary-500 hover:bg-transparent",
        isActive ? 'font-bold text-secondary-500' : ''
      )}
    >
      <Link href={href}>
        {label}
      </Link>
    </Button>
  );
};


export function HeaderLinks({ isAuthenticated }: { isAuthenticated: boolean }) {
  const pathname = usePathname();
  const { isMobile } = useMediaQuery();
  const isLandingPage = pathname === "/";

  if (isMobile) return null;

  return (
    <>
      {!isLandingPage && isAuthenticated && (
        <div className="flex items-center gap-2">
          <HeaderButton href={"/"} label={"Trang chủ"} isActive={pathname === '/'} />
          <HeaderButton href={"/products"} label={"Sản phẩm"} isActive={pathname.startsWith('/products')} />
          <HeaderButton href={"/promotion"} label={"Khuyến mãi"} isActive={pathname === '/promotion'} />         
          <HeaderButton href={"/about"} label={"Giới thiệu"} isActive={pathname === '/about'} />
          <HeaderButton href={"/blogs"} label={"Bài viết"} isActive={pathname.startsWith('/blogs')} />
        </div>
      )}

      {(isLandingPage || !isAuthenticated) && (
        <div className="flex gap-2">
          <HeaderButton href={"/"} label={"Trang chủ"} isActive={pathname === '/'} />
          <HeaderButton href={"/products"} label={"Sản phẩm"} isActive={pathname.startsWith('/products')} />
          <HeaderButton href={"/promotion"} label={"Khuyến mãi"} isActive={pathname === '/promotion'} />         
          <HeaderButton href={"/about"} label={"Giới thiệu"} isActive={pathname === '/about'} />
          <HeaderButton href={"/blogs"} label={"Bài viết"} isActive={pathname.startsWith('/blogs')} />
        </div>
      )}
    </>
  );
}
