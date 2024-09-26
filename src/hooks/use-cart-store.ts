import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from 'uuid';
import { debounce } from "lodash";

export interface CustomBracelet {
    id: string;
    stringType: {
        id: number;
        material: string;
        color: string;
        price: number;
        imageUrl: string;
    };
    charms: {
        id: number;
        name: string;
        imageUrl: string;
        price: number;
        position: number;
    }[];
    price: number;
    quantity: number;
}


export interface CheckoutPayload {
    id?: number; //order id
    userId?: number; //user id
    name: string;
    phone: string;
    email: string;
    paymentMethod: string;
    address: string;
    ward: string;
    district: string;
    orderItems: CartItem[];
    totalPrice?: number;
    trackingNumber?: string;
};

export type CheckoutFormType = {
    name: string;
    phone: string;
    email: string;
    paymentMethod: string;
    ward: string; // Add this line if 'ward' is a field in your form
    // province: string; // Add this line if 'province' is a field in your form
    district: string; // Add this line if 'district' is a field in your form
    address: string;
  };

export interface CartItem {
    productId: number;
    quantity: number;
    subtotal: number;
}

export interface ProductType {
    id: number;
    name: string;
    description: string;
    currentQuantity: number;
    price: number;
    salePrice: number;
    imgProducts: ImgProductType[];
    categoryId: number;
    isActivated: boolean;
    quantity: number;
};

export interface addToCartProductType{
    id: number;
    name: string;
    description: string;
    currentQuantity: number;
    price: number;
    salePrice: number;
    imgProducts: ImgProductType[];
    categoryId: number;
    isActivated: boolean;
}

export interface CartItemType {
    productId: number;
    quantity: number;
    subtotal: number;
  };


export interface ProductCategoryType {
    id: number;
    name?: string;
    isActive?: boolean;
};

export interface ImgProductType {
    id: number;
    imageUrl: string;
    publicId: string;
    productId: number;
};


interface State {
    cart: ProductType[];
    customBracelets: CustomBracelet[];
    totalItems: number;
    totalPrice: number;
    checkoutPayload: CheckoutPayload | null;
}

interface Actions {
    addToCart: (product: addToCartProductType, quantity: number) => void;
    removeFromCart: (product: ProductType) => void;
    updateCartItem: (product: ProductType, quantity: number) => void;
    clearCart: () => void;
    setCheckoutPayload: (payload: CheckoutPayload) => void;
    getCheckoutPayload: () => CheckoutPayload | null;
    clearCheckoutPayload: () => void;
    addToCustomBracelet: (bracelet: CustomBracelet) => void;
    removeFromCustomBracelet: (bracelet: CustomBracelet) => void;
    updateCustomBracelet: (bracelet: CustomBracelet, quantity: number) => void;
}

type PersistedState = State & Partial<{ totalProducts: number }>;

const INITIAL_STATE: State = {
    cart:[],
    customBracelets: [],
    totalItems: 0,
    totalPrice: 0,
    checkoutPayload: null,
}

export const useCartStore = create(
    persist<State & Actions>(
        (set, get) => ({
            ...INITIAL_STATE,
            addToCart: (product, quantity: number = 1) => {
                const cart = get().cart;
                const cartItem = cart.find(item => item.id === product.id);
                if (cartItem) {
                    const updatedCart = cart.map(item =>
                        item.id === product.id
                            ? { ...item, quantity: (item.quantity as number) + quantity }
                            : item
                    );
                    set((state) => ({
                        cart: updatedCart,
                        totalItems: state.totalItems + quantity,
                        totalPrice: state.totalPrice + product.salePrice * quantity,
                    }));
                } else {
                    const updatedCart = [...cart, { ...product, quantity }]
                    set((state) => ({
                        cart: updatedCart,
                        totalItems: state.totalItems + quantity,
                        totalPrice: state.totalPrice + product.salePrice * quantity,
                    }));
                }
            },
            removeFromCart: (product: ProductType) => {
                const cart = get().cart;
                const cartItem = cart.find((item) => item.id === product.id);
                if (cartItem) {
                    const updatedCart = cart.filter((item) => item.id !== product.id);
                    set((state) => ({
                        cart: updatedCart,
                        totalItems: state.totalItems - cartItem.quantity,
                        totalPrice: state.totalPrice - cartItem.salePrice * cartItem.quantity,
                    }));
                }
            },
            updateCartItem: debounce((product: ProductType, quantityChange: number) => {
                set((state) => {
                    const cartItemIndex = state.cart.findIndex((item) => item.id === product.id);
                    if (cartItemIndex !== -1) {
                        const cartItem = state.cart[cartItemIndex];
                        const newQuantity = Math.max(1, cartItem.quantity + quantityChange);
                        const quantityDiff = newQuantity - cartItem.quantity;
                        
                        const updatedCart = [...state.cart];
                        updatedCart[cartItemIndex] = { ...cartItem, quantity: newQuantity };
            
                        return {
                            cart: updatedCart,
                            totalItems: state.totalItems + quantityDiff,
                            totalPrice: state.totalPrice + product.salePrice * quantityDiff,
                        };
                    }
                    return state;
                });
            }, 300),
            clearCart: () => {
                set((state) => ({
                    cart: [],
                    totalItems: 0,
                    totalPrice: 0,
                }));
            },
            setCheckoutPayload: (payload: CheckoutPayload) => {
                set({ checkoutPayload: payload });
            },
            getCheckoutPayload: () => {
                return get().checkoutPayload;
            },
            clearCheckoutPayload: () => {
                set({ checkoutPayload: null });
            },
            addToCustomBracelet: (bracelet: CustomBracelet) => {
                set((state) => ({
                    customBracelets: [...state.customBracelets, {...bracelet}],
                    totalItems: state.totalItems + bracelet.quantity,
                    totalPrice: state.totalPrice + bracelet.price,
                }));
            },
            removeFromCustomBracelet: (bracelet: CustomBracelet) => {
                const customBracelets = get().customBracelets;
                const updatedCustomBracelets = customBracelets.filter(item => item.id !== bracelet.id);
                set((state) => ({
                    customBracelets: updatedCustomBracelets,
                    totalItems: state.totalItems - bracelet.quantity,
                    totalPrice: state.totalPrice - bracelet.price,
                }));
            },
            updateCustomBracelet: (bracelet: CustomBracelet, quantity: number) => {
                const customBracelets = get().customBracelets;
                const updatedCustomBracelets = customBracelets.map(item =>
                    item.id === bracelet.id ? { ...item, quantity: Math.max(1, item.quantity + quantity) } : item
                );
                set((state) => ({
                    customBracelets: updatedCustomBracelets,
                    totalItems: state.totalItems + quantity,
                    totalPrice: state.totalPrice + bracelet.price,
                }));
            },
        }), {
        name: 'cart-store',
        version: 1,
        migrate: (persistedState: unknown, version: number) => {
            const state = persistedState as PersistedState;
            if (version === 0 && state.totalProducts !== undefined) {
                state.totalItems = state.totalProducts;
                delete state.totalProducts;
            }
            return state as State & Actions;
        },
    }
    )
)