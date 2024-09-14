"use client";
import { useToast } from "@/components/ui/use-toast";
import {  useState } from "react";
import { useServerAction } from "zsa-react";
import { deleteCharmAction } from "./action";
import { DeleteModal } from "@/components/delete-modal";


export function DeleteCharmButton({ charmId }: { charmId: number }) {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);

    const { execute, error, isPending } = useServerAction(deleteCharmAction, {
      onSuccess: () => {
        toast({
          title: "Charm deleted",
          variant: "success",
          description: "Charm deleted successfully",
        });
        setIsOpen(false);
      },
      onError: () => {
        toast({
          title: "Error",
          variant: "error",
          description: error?.message || "An error occurred while deleting the charm"
        });
      },
    });
  
    return (
      <DeleteModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Delete Charm"
        description="Are you sure you want to delete this charm? This action cannot be undone."
        onConfirm={() => execute({ charmId })}
        isPending={isPending}
      />
    );
  }