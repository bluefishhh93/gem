'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/hooks/use-cart-store';

export default function ClearCart() {
  const clearCart = useCartStore((state) => state.clearCart);
  //clear checkoutpayload
  const clearCheckoutPayload = useCartStore((state) => state.clearCheckoutPayload);

  useEffect(() => {
    clearCart();
    clearCheckoutPayload();
  }, [clearCart, clearCheckoutPayload]);

  return null;
}