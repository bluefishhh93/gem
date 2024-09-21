'use client';

import { useCartStore } from "@/hooks/use-cart-store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CheckoutForm from "./component/CheckoutForm";

export default function CheckoutWrapper({
  user
}: {
  user: {
    displayName?: string | null | undefined;
    image?: string | null | undefined;
    role?: "user" | "admin" | undefined;
    email?: string | null | undefined;
    id?: number | undefined;
  } | undefined;
}) {

  const { cart } = useCartStore();

  const router = useRouter();

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/');
    }
  }, [cart, router]);

  if (cart.length === 0) {
    return null;
  }

  return <CheckoutForm user={user ?? undefined} />;
}