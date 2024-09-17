'use client';
import { ProductType} from '@/hooks/use-cart-store'
import CartItem from "./CartItem";

interface CartItemListProps {
  cart: ProductType[];
  insufficientList: number[];
}

export default function CartItemList({ cart, insufficientList }: CartItemListProps) {
  return (
    <ul className="grid gap-4 px-6">
      {cart.map((product) => (
        <li
          key={product.id}
          className={`relative ${
            insufficientList.includes(product.id as never)
              ? "border-2 border-red-500 rounded-lg p-2"
              : ""
          }`}
        >
          <CartItem item={product} />
          {insufficientList.includes(product.id as never) && (
            <span className="absolute top-0 right-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded-b-md">
              Insufficient Stock
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}