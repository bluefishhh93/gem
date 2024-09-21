"use client";

import { Button } from "@/components/ui/button";
import { useServerAction } from "zsa-react";
import { toggleUserRoleAction } from "./actions";
import { User } from "@/db/schema";
import { useToast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, EllipsisVertical, UserCog, UserMinus } from "lucide-react";
export function UserActions({ user }: { user: User }) {
  const { toast } = useToast();
  const { execute, isPending } = useServerAction(toggleUserRoleAction, {
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User role updated successfully",
        variant: "success",
      });
    },
    onError: ({ err }) => {
      toast({
        title: "Error",
        description: err.message || "Failed to update user role",
        variant: "destructive",
      });
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => execute({ userId: user.id })} disabled={isPending}>
          <UserCog className="mr-2 h-4 w-4" />
          {isPending ? "Updating..." : `Make ${user.role === "user" ? "Admin" : "User"}`}
        </DropdownMenuItem>
        {/* <DropdownMenuItem>
          <UserMinus className="mr-2 h-4 w-4" />
          Delete User
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}