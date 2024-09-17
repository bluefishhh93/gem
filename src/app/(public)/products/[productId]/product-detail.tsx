'use client'
import { Breadcrumb } from "@/components/Breadcrumb";
import { Product } from "@/db/schema";
import Image from "next/image";
import { useState } from "react";

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
}

export default function ProductDetail({ product }: { product: ProductDetail }) {

    const [activeIndex, setActiveIndex] = useState(0);

    const handleThumbnailClick = (index: any) => {
        setActiveIndex(index);
    }



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
            </div>
        </div>
    )
}