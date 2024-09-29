"use client"
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import RatingButton from "./rating-button";
import CustomBraceletImage from "@/components/custom-bracelet-image";
import { vietnamCurrency } from "@/util/util";

const IMAGE_NOT_FOUND = "/path/to/image-not-found.jpg"; // Update this path as needed

interface OrderItemType {
  id: number;
  quantity: number;
  subtotal: number;
  product?: {
    id: number;
    name: string;
    price: number;
    imgProducts: {imageUrl: string, publicId: string}[];
  };
  customBracelet?: {
    id: number;
    totalPrice: number;
    charms: {
      id: number;
      name: string;
      imageUrl: string;
      position: number;
    }[];
    string: {
      material: string;
      color: string;
      imageUrl: string;
    };
  };
  isCustomBracelet: boolean;
  isRated: boolean;
}

interface OrderItemsProps {
  items: OrderItemType[]; 
  status: string;
}

const OrderItems: React.FC<OrderItemsProps> = ({ items, status }) => {
  return (
    <div className="space-y-3 w-full">
      {items.map((item) => (
        <div
          key={item.isCustomBracelet ? `custom-${item.customBracelet?.id}` : `product-${item.product?.id}`}
          className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
        >
          <div className="flex-shrink-0">
            {item.isCustomBracelet && item.customBracelet ? (
              <Image 
                src={'/gem-custom.png'}
                alt="Custom Bracelet"
                width={48}
                height={48}
                className="rounded-md object-cover"
              />
            ) : item.product ? (
              <Image
                src={item.product.imgProducts[0]?.imageUrl || IMAGE_NOT_FOUND}
                alt={item.product.name}
                width={48}
                height={48}
                className="rounded-md object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
            )}
          </div>
          <div className="flex-grow min-w-0">
            <p className="font-medium text-sm truncate">
              {item.isCustomBracelet ? `Vòng tay custom` : item.product?.name || "Unknown Product"}
            </p>
            <p className="text-xs text-gray-500">
              {item.quantity} x {vietnamCurrency(item.subtotal / item.quantity)}
            </p>
          </div>
          <div className="flex flex-col items-end sm:items-center">
            <p className="font-medium text-sm whitespace-nowrap">
              {vietnamCurrency(item.subtotal)}
            </p>
            {status === "completed" && !item.isRated && !item.isCustomBracelet && item.product && (
              <RatingButton
                orderItemId={item.id}
                productId={item.product.id}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderItems;