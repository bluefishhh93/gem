"use client"

import { Button } from "@/components/ui/button"
import { InteractiveOverlay } from "@/components/interactive-overlay";
import { useState } from "react";
import CreateStringForm from "./create-string-form";
import { btnStyles } from "@/styles/icons";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";

export function CreateStringButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <InteractiveOverlay
                title={""}
                description={""}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                form={<CreateStringForm setIsOpen={setIsOpen} />}
            />

            <Button
                onClick={() => {
                    setIsOpen(true);
                }}
                className={cn(btnStyles, "mr-8")}
            >
                <PlusIcon className="w-4 h-4" />
                Create String
            </Button>
        </>
    )
}