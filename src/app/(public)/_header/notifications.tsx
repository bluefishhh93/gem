"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Notification } from "@/db/schema";
import { BellIcon, FrownIcon, SmileIcon } from "lucide-react";
import Link from "next/link";
import { markNotificationAsReadAction } from "./actions";
import { useServerAction } from "zsa-react";
import { getNotificationIcon, getNotificationLink } from "@/util/notifications";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Notifications({
  notifications,
}: {
  notifications: Notification[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { execute } = useServerAction(markNotificationAsReadAction, {
    onSuccess() {
      setIsOpen(false);
    },
  });

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div className="p-2 relative">
          <Button variant="outline" size="icon">
            <BellIcon className="h-4 w-4" />
          </Button>
          {notifications.length > 0 && (
            <div className="absolute top-1 right-[1px] w-2 h-2 bg-red-500 rounded-full flex items-center justify-center text-xs text-white"></div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Thông Báo</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg">
            <SmileIcon className="h-8 w-8 text-gray-400 mb-2" />
            <div className="text-gray-500 font-medium">Không có thông báo nào</div>
            <p className="text-sm text-gray-400 mt-1">Chúng tôi sẽ thông báo khi có thông báo mới</p>
          </div>
        )}

        {notifications.map((notification) => (
          <DropdownMenuItem key={notification.id} asChild>
            <Link
              onClick={async () => {
                await execute({ notificationId: notification.id });
              }}
              className="cursor-pointer"
              href={getNotificationLink(notification)}
            >
              <div className="flex items-center gap-2 p-4">
                {getNotificationIcon(notification)}
                <div>{notification.message}</div>
              </div>
            </Link>
          </DropdownMenuItem>
        ))}

        <div className="flex justify-center py-4">
          <Link
            onClick={() => {
              setIsOpen(false);
            }}
            className="text-xs text-secondary-400 hover:text-secondary-500"
            href="/#"
          >
            Xem Thông Báo
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
