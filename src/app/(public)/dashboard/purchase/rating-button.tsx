import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DialogOverlay } from "@/components/dialog-overlay";
import { RatingForm } from "./rating-form";

export default function RatingButton({
    orderItemId,
    productId
}: {
    orderItemId: number;
    productId: number;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <DialogOverlay 
            isOpen={isOpen} 
            setIsOpen={setIsOpen} 
            title="" 
            description="" 
            form={<RatingForm setIsOpen={setIsOpen} orderItemId={orderItemId} productId={productId} />}/>
          
            <Button onClick={() => setIsOpen(true)}>
                Đánh giá
            </Button>
        </>
    )
}
