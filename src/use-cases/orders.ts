'use server';
import { checkIneficient, getProductById } from "@/data-access/products";

export async function checkIneficientUseCase(cartItems: {
    productId: number;
    quantity: number;
}[]){
   const insufficientProducts = await checkIneficient(cartItems);
   return insufficientProducts;
}

export async function getProductByIdUseCase(id: number) {
    const product = await getProductById(id);
    return product;
}

