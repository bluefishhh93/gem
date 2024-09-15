"use client";

import { applicationName } from "@/app-config";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { dancingScript } from "@/util/fonts";
import { cn } from "@/lib/utils";

export function HeaderLogo() {


  return (
    <Link
      href={"/"}
      className="flex gap-2 items-center text-xl"
    >
      <Image
        className="rounded w-16 h-16"
        width={300}
        height={300}
        src="/gem-removebg.png"
        alt="hero image"
      />
      <span className={cn(dancingScript.className, " text-secondary-500 text-base dark:text-secondary-50")}>Wear Your Stars</span>
    </Link>
  );
}
