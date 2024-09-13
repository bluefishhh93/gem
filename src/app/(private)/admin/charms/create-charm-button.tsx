"use client"

import { Button } from "@/components/ui/button"
import { InteractiveOverlay } from "@/components/interactive-overlay";
import { useState } from "react";
import CreateCharmForm from "./create-charm-form";
import { btnStyles } from "@/styles/icons";

export function CreateCharmButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <InteractiveOverlay
                title={"Create Charm"}
                description={"Create a new charm."}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                form={<CreateCharmForm setIsOpen={setIsOpen} />}
            />

            <Button
                onClick={() => {
                    setIsOpen(true);
                }}
                className={btnStyles}
            >
                Create Charm
            </Button>
        </>
    )
}

