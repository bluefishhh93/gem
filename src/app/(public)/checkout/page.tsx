import { getCurrentUserInfo } from "@/lib/session";
import CheckoutWrapper from "./checkout-wrapper";


export default async function CheckoutPage() {
  return (
    <main className="flex-1 py-8 px-4 md:px-8">
      <CheckoutWrapper />
    </main>
  );
}