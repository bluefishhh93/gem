import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/mode-toggle";
import { HeaderLinks } from "@/app/(public)/_header/header-links";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/session";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings2Icon } from "lucide-react";
import { HeaderActionsFallback } from "@/app/(public)/_header/header-actions-fallback";
import { applicationName } from "@/app-config";
import { SignOutItem } from "@/app/(public)/_header/sign-out-item";
import {
  getUnreadNotificationsForUserUseCase,
  getUserProfileUseCase,
} from "@/use-cases/users";
import { getProfileImageFullUrl } from "@/app/(public)/dashboard/settings/profile/profile-image";
import { Notifications } from "./notifications";
import { MenuButton } from "./menu-button";
import Container from "@/components/container";
import { HeaderLogo } from "./header-logo";

export async function Header() {
  const user = await getCurrentUser();
  return (
    <div className="px-5 md:px-6 bg-secondary-50 dark:bg-secondary-300">
      <div className="mx-auto flex w-full max-w-7xl py-4 items-center">
        <HeaderLogo />

        <div className="flex-grow flex justify-center">
          <HeaderLinks isAuthenticated={!!user} />
        </div>

        <div className="flex items-center gap-1">
          <Suspense fallback={<HeaderActionsFallback />}>
            <HeaderActions />
          </Suspense>
        </div>
      </div>
    </div>
  );
  
}

async function ProfileAvatar({ userId }: { userId: number }) {
  const profile = await getUserProfileUseCase(userId);

  return (
    <Avatar>
      <AvatarImage src={getProfileImageFullUrl(profile.image)} />
      <AvatarFallback>
        {profile.displayName?.substring(0, 2).toUpperCase() ?? "AA"}
      </AvatarFallback>
    </Avatar>
  );
}

export async function HeaderActions() {
  const user = await getCurrentUser();
  const isSignedIn = !!user;

  return (
    <>
      {isSignedIn ? (
        <>
          <div className="hidden md:block">
            <ModeToggle />
          </div>

          <Suspense>
            <NotificationsWrapper />
          </Suspense>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Suspense
                fallback={
                  <div className="bg-gray-800 rounded-full h-10 w-10 shrink-0 flex items-center justify-center">
                    ..
                  </div>
                }
              >
                <ProfileAvatar userId={user.id} />
              </Suspense>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="space-y-2">
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/settings"
                  className="flex gap-2 items-center cursor-pointer"
                >
                  <Settings2Icon className="w-4 h-4" /> Cài đặt
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/purchase"
                  className="flex gap-2 items-center cursor-pointer"
                >
                  <Settings2Icon className="w-4 h-4" /> Đơn hàng
                </Link>
              </DropdownMenuItem>
              <SignOutItem />
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="md:hidden">
            <MenuButton />
          </div>
        </>
      ) : (
        <>
          <ModeToggle />

          <Button asChild variant="secondary" className=" bg-secondary-500 hover:bg-secondary-600 text-white ">
            <Link href="/sign-in">Đăng nhập</Link>
          </Button>
          <div className="md:hidden">
            <MenuButton />
          </div>
        </>
      )}
    </>
  );
}

export async function NotificationsWrapper() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const notifications = await getUnreadNotificationsForUserUseCase(user.id);

  return <Notifications notifications={notifications} />;
}
