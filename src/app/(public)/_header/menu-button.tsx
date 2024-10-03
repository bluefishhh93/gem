"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MenuItem = ({ href, label, isActive }: { href: string; label: string; isActive: boolean }) => {
  return (
    <DropdownMenuItem asChild>
      <Link
        href={href}
        className={cn(
          "flex gap-2 items-center cursor-pointer",
          isActive ? "font-bold text-secondary-500" : ""
        )}
      >
        {label}
      </Link>
    </DropdownMenuItem>
  );
};

export function MenuButton() {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MenuIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="space-y-2">
        <MenuItem href="/" label="Trang chủ" isActive={pathname === '/'} />
        <MenuItem href="/products" label="Sản phẩm" isActive={pathname === '/products'} />
        {/* <MenuItem href="/promotion" label="Khuyến mãi" isActive={pathname === '/promotion'} /> */}
        <MenuItem href="/about" label="Giới thiệu" isActive={pathname === '/about'} />
        <MenuItem href="/blogs" label="Bài viết" isActive={pathname === '/blogs'} />
        <MenuItem href="/astrology" label="Tử vi" isActive={pathname === '/astrology'} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}