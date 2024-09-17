import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CheckoutPayload {
    id?: number; //order id
    userId?: string; //user id
    name?: string;
    phone?: string;
    email?: string;
    paymentMethod?: string;
    shipAddress?: string;
    orderItems?: CartItem[];
    totalPrice?: number;
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
}

type PersistedState = State & Partial<{ totalProducts: number }>;

const INITIAL_STATE: State = {
    cart: [],
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
                        totalPrice: state.totalPrice + product.price * quantity,
                    }));
                } else {
                    const updatedCart = [...cart, { ...product, quantity }]
                    set((state) => ({
                        cart: updatedCart,
                        totalItems: state.totalItems + quantity,
                        totalPrice: state.totalPrice + product.price * quantity,
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
                        totalPrice: state.totalPrice - cartItem.price * cartItem.quantity,
                    }));
                }
            },
            updateCartItem: (product: ProductType, quantityChange: number) => {
                const cart = get().cart;
                const cartItem = cart.find((item) => item.id === product.id);
                if (cartItem) {
                    const newQuantity = Math.max(1, cartItem.quantity + quantityChange);
                    const updatedCart = cart.map((item) =>
                        item.id === product.id ? { ...item, quantity: newQuantity } : item
                    );
                    set((state) => ({
                        cart: updatedCart,
                        totalItems: state.totalItems + quantityChange,
                        totalPrice: state.totalPrice + product.price * quantityChange,
                    }));
                }
            },
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