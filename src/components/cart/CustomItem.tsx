import { CustomBracelet, useCartStore } from "@/hooks/use-cart-store";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CustomBraceletImage from "../custom-bracelet-image";
import { TrashIcon } from "lucide-react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Alert } from "@/components/Alert";

export function CustomItem({ customBracelet }: { customBracelet: CustomBracelet }) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const updateCustomBracelet = useCartStore((state) => state.updateCustomBracelet);
  const removeFromCustomBracelet = useCartStore((state) => state.removeFromCustomBracelet);

  const handleRemove = () => {
    setIsAlertOpen(true);
  };

  const handleConfirm = () => {
    removeFromCustomBracelet(customBracelet);
    setIsAlertOpen(false);
  };

  const handleCancel = () => {
    setIsAlertOpen(false);
  };

  const handleUpdateQuantity = async (change: number) => {
    if (change === -1 && customBracelet.quantity === 1) {
      handleRemove();
      return;
    } else {
      updateCustomBracelet(customBracelet, change);
    }
  };


  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
      <CustomBraceletImage stringType={customBracelet.string} charms={customBracelet.charms} />
      <div className="grid gap-1">
        <h4 className="font-medium">{`Vòng tay custom`}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {
            new Intl.NumberFormat("vi", {
              style: "currency",
              currency: "VND",
            }).format(customBracelet.price)
          }
        </p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <Button
            className="text-red-500 dark:text-red-400"
            variant="ghost"
            size="icon"
            onClick={handleRemove}
          >
            <TrashIcon className="h-4 w-4" />
            <span className="sr-only">Remove item</span>
          </Button>
          <Alert
            title="Xóa sản phẩm khỏi giỏ hàng?"
            description="Hành động này không thể hoàn tác. Điều này sẽ xóa sản phẩm khỏi giỏ hàng của bạn."
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            open={isAlertOpen}
            setOpen={setIsAlertOpen}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              customBracelet.quantity === 1 ? handleRemove() : handleUpdateQuantity(-1)
            }
          >
            <MinusIcon className="h-4 w-4" />
            <span className="sr-only">Decrease item</span>
          </Button>
          <span className="font-medium w-3">{customBracelet.quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleUpdateQuantity(1)}
          >
            <PlusIcon className="h-4 w-4" />
            <span className="sr-only">Increase item</span>
          </Button>
        </div>
        <div className="h-[1px] text-xs text-red-500">
          {errorMessage && (
            <p>{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}