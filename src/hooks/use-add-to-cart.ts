"use client";
import { useCallback, useState, useRef } from "react";
import { toast } from "@/components/ui/use-toast";
import { addToCartProductType, useCartStore } from "./use-cart-store";
import { posthogInstance } from "@/lib/posthog";

export const useAddToCart = () => {
    const addToCart = useCartStore((state) => state.addToCart);
    const cart = useCartStore((state) => state.cart);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = useCallback((quantity: number = 1,product: addToCartProductType)=> {
        if(isAdding) return;

        setIsAdding(true);

        const cartItem = cart?.find((item) => item.id === product.id);
        if(cartItem && cartItem.quantity + quantity > product.currentQuantity){
            toast({
                title: "Thông báo",
                description: "Số lượng sản phẩm không đủ",
                variant: "error",
            })
        }else{
            addToCart(product, quantity);
            posthogInstance.capture('product_added_to_cart', {
                product_id: product.id,
                product_name: product.name,
                quantity:quantity
              });
            toast({
                title: "Thông báo",
                description: "Sản phẩm đã được thêm vào giỏ hàng",
                variant: "success",
            })
        }
        setTimeout(() => setIsAdding(false), 500);
    },[cart, isAdding, addToCart])

    return { handleAddToCart, isAdding };
}