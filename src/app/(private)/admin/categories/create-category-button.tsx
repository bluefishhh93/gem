"use client"

import { Button } from "@/components/ui/button"
import { InteractiveOverlay } from "@/components/interactive-overlay";
import { useState } from "react";
import CreateCategoryForm from "./create-category-form";
import { btnStyles } from "@/styles/icons";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";

export function CreateCategoryButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <InteractiveOverlay
                title={""}
                description={""}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                form={<CreateCategoryForm setIsOpen={setIsOpen} />}
            />

            <Button
                onClick={() => {
                    setIsOpen(true);
                }}
                className={cn(btnStyles, "flex items-center mr-8")}
            >
                <PlusIcon className="w-4 h-4" />
                Create Category
            </Button>
        </>
    )
}