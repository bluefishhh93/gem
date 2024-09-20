import { Button } from "@/components/ui/button";
import { TruckIcon } from "lucide-react";

interface CheckoutButtonProps {
  insufficientList: number[];
  onCheckout: () => void;
}

export default function CheckoutButton({ insufficientList, onCheckout }: CheckoutButtonProps) {
  return (
    <Button
      className={`w-full py-3 rounded-full text-white transition-transform ${
        insufficientList.length > 0
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-secondary-300 hover:bg-secondary-500 dark:bg-secondary-500 dark:hover:bg-secondary-600"
      }`}
      onClick={() => {
        if (insufficientList.length === 0) {
          onCheckout();
        }
      }}
      disabled={insufficientList.length > 0}
    >
      <TruckIcon className="h-5 w-5 mr-2" />
      {insufficientList.length > 0
        ? "Kiểm tra giỏ hàng"
        : "Tiến hành thanh toán"}
    </Button>
  );
}