'use client'
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product } from "@/db/schema";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import { vietnamCurrency } from "@/util/util";
import { MinusIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import { useReducer, useState } from "react";
import ProductComment, { ReviewType } from "../components/ProductComment/ProductComment";
import React from "react";

interface ProductDetail {
    id: number;
    name: string;
    description: string;
    currentQuantity: number;
    price: number;
    salePrice: number;
    isActivated: boolean;
    categoryId: number;
    imgProducts: {
        id: number;
        imageUrl: string;
        publicId: string;
        productId: number;
    }[];
    reviews: ReviewType[];
}

type State = {
    quantity: number;
};

type Action =
    | { type: "INCREMENT" }
    | { type: "DECREMENT" }
    | { type: "SET_QUANTITY"; payload: number };

const initialState: State = {
    quantity: 1,
};

function reducer(state: State, action: Action, maxQuantity: number): State {
    switch (action.type) {
        case "INCREMENT":
            return { ...state, quantity: Math.min(state.quantity + 1, maxQuantity) };
        case "DECREMENT":
            return { ...state, quantity: Math.max(1, state.quantity - 1) };
        case "SET_QUANTITY":
            return {
                ...state,
                quantity: Math.max(1, Math.min(action.payload, maxQuantity)),
            };
        default:
            return state;
    }
}


export default function ProductDetail({ product }: { product: ProductDetail }) {

    const [activeIndex, setActiveIndex] = useState(0);
    const [state, dispatch] = useReducer(
        (state: State, action: Action) =>
            reducer(state, action, product.currentQuantity),
        initialState
    )

    const { handleAddToCart, isAdding } = useAddToCart();

    const handleQuantityChange = (value: number) => {
        dispatch({
            type: "SET_QUANTITY",
            payload: Math.max(1, Math.min(value, product.currentQuantity)),
        });
    };

    const handleThumbnailClick = (index: any) => {
        setActiveIndex(index);
    }

    const handleClick = () => {
        handleAddToCart(state.quantity, product);
    };


    return (
        <div className="max-w-6xl mx-auto px-4">
            <Breadcrumb items={[{ label: 'Trang chủ', link: '/' }, { label: 'Sản phẩm', link: '/products' }, { label: product.name, link: `/products/${product.id}` }]} />
            <div className=" grid items-start gap-6 py-6 md:grid-cols-2 lg:gap-12">
                <div className="flex items-start gap-4 md:gap-6">

                    <div className="flex flex-col space-y-2">
                        {product.imgProducts.map((image, index) => (
                            <Image
                                key={index}
                                src={image.imageUrl}
                                alt="Vòng Tay Hoàng Đạo"
                                width={100}
                                height={100}
                                className={`aspect-square cursor-pointer overflow-hidden rounded-lg border object-cover ${index === activeIndex ? 'border-pink-500' : ''
                                    }`}
                                onClick={() => handleThumbnailClick(index)}
                            />
                        ))}
                    </div>

                    {/* Main image */}
                    <div className="w-full max-w-md">
                        <Image
                            src={product.imgProducts[activeIndex].imageUrl}
                            alt="Vòng Tay Hoàng Đạo"
                            width={800}
                            height={800}
                            className="aspect-square w-full overflow-hidden rounded-lg border object-cover"
                        />
                    </div>
                </div>
                <div className="grid items-start gap-6 md:gap-12">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-sans tracking-tight lg:text-5xl">
                            {product.name}
                        </h1>
                        <h1 className="flex items-center gap-4 text-muted">
                            {product.salePrice < product.price ? (
                                <>
                                    <span className="text-xl font-semibold text-gray-500 line-through">
                                        {vietnamCurrency(product.price)}
                                    </span>
                                    <span className="text-3xl font-bold text-secondary-600">
                                        {vietnamCurrency(product.salePrice)}
                                    </span>
                                </>
                            ) : (
                                <span className="text-3xl font-bold text-secondary-600">
                                    {product.price.toLocaleString('vi-VN')}đ
                                </span>
                            )}
                        </h1>
                    </div>
                    <div className="flex flex-col bg-gray-100 dark:bg-gray-800">
                        <div className="flex items-center gap-2 p-2 rounded-lg">
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => dispatch({ type: "DECREMENT" })}
                                aria-label="Decrease quantity"
                                disabled={state.quantity <= 1}
                                className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                <MinusIcon className="w-4 h-4" />
                            </Button>
                            <Input
                                id="quantity"
                                type="number"
                                min="1"
                                max={product.currentQuantity}
                                value={state.quantity}
                                onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
                                className="w-16 text-center bg-white dark:bg-gray-900 border-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
                                aria-label="Quantity"
                            />
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => dispatch({ type: "INCREMENT" })}
                                aria-label="Increase quantity"
                                disabled={state.quantity >= product.currentQuantity}
                                className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                <PlusIcon className="w-4 h-4" />
                            </Button>
                        </div>

                        <Button
                            size="lg"
                            className="w-full h-16 bg-primary-600 dark:bg-primary-700 hover:bg-primary-400 dark:hover:bg-primary-500"
                            onClick={handleClick}
                            disabled={isAdding}
                        >
                            {isAdding ? "Đang xử lí..." : "Thêm vào giỏ hàng"}
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Mô tả sản phẩm</h2>
                        <p className="">{product.description}</p>
                    </div>

                    <ProductComment reviews={product.reviews} isAdmin={false} />

                </div>



            </div>
        </div>
    )
}