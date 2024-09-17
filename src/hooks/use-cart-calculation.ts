import { useMemo } from 'react';
import { ProductType } from './use-cart-store';
import { getItemList } from '@/util/util';

export default function useCartCalculations(cart: ProductType[]) {
  const { total, cartItems } = useMemo(() => {
    if (!cart || cart.length === 0) {
      return { total: 0, cartItems: [] };
    }

    const items = getItemList(cart);
    const totalAmount = items.reduce((acc, item) => acc + item.subtotal, 0);

    return { total: totalAmount, cartItems: items };
  }, [cart]);

  return { total, cartItems };
}