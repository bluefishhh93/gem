import React, { useState } from 'react';
import { useCartStore } from '@/hooks/use-cart-store';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { vietnamCurrency } from '@/util/util';
import { MinusIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { CheckoutForm } from '../checkout/component/CheckoutForm';

interface CustomBracelet {
  id: string;
  string: {
    id: number;
    material: string;
    color: string;
    price: number;
  };
  charms: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
  }[];
  quantity: number;
}

export default function CustomCheckout() {
  const [customBracelet, setCustomBracelet] = useState<CustomBracelet>({
    id: 'custom-1',
    string: { id: 1, material: 'Leather', color: 'Brown', price: 50000 },
    charms: [
      { id: 1, name: 'Heart', price: 20000, imageUrl: '/images/heart-charm.jpg' },
      { id: 2, name: 'Star', price: 25000, imageUrl: '/images/star-charm.jpg' },
    ],
    quantity: 1,
  });
  const { cart, updateCartItem, removeFromCart } = useCartStore();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<number | null>(null);

  const handleUpdateQuantity = (itemId: string, change: number) => {
    if (itemId === customBracelet.id) {
      setCustomBracelet(prev => ({
        ...prev,
        quantity: Math.max(1, prev.quantity + change)
      }));
    } else {
      updateCartItem(cart.find(item => item.id === parseInt(itemId))!, change);
    }
  };

  const handleRemove = (itemId: string) => {
    if (itemId === customBracelet.id) {
      setIsAlertOpen(true);
    } else {
      setItemToRemove(parseInt(itemId));
      setIsAlertOpen(true);
    }
  };

  const handleConfirmRemove = () => {
    if (itemToRemove !== null) {
      removeFromCart(cart.find(item => item.id === itemToRemove)!);
    } else {
      // Handle removal of custom bracelet (e.g., redirect to customization page)
    }
    setIsAlertOpen(false);
    setItemToRemove(null);
  };

  const calculateTotal = () => {
    const customBraceletTotal = (customBracelet.string.price + 
      customBracelet.charms.reduce((sum, charm) => sum + charm.price, 0)) * customBracelet.quantity;
    const cartTotal = cart.reduce((sum, item) => sum + item.salePrice * item.quantity, 0);
    return customBraceletTotal + cartTotal;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Custom Bracelet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Image 
                  src="/images/custom-bracelet.jpg" 
                  alt="Custom Bracelet" 
                  width={100} 
                  height={100} 
                  className="rounded-md"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold">{customBracelet.string.material} Bracelet</h3>
                  <p className="text-sm text-gray-500">
                    {customBracelet.charms.length} charms • {customBracelet.string.color}
                  </p>
                  <p className="font-medium">{vietnamCurrency(customBracelet.string.price + 
                    customBracelet.charms.reduce((sum, charm) => sum + charm.price, 0))}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleUpdateQuantity(customBracelet.id, -1)}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                  <span className="font-medium">{customBracelet.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleUpdateQuantity(customBracelet.id, 1)}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(customBracelet.id)}
                  >
                    <TrashIcon className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {cart.map((item) => (
            <Card key={item.id} className="mb-4">
              <CardContent className="flex items-center space-x-4 py-4">
                <Image 
                  src={item.imgProducts[0].imageUrl} 
                  alt={item.name} 
                  width={64} 
                  height={64} 
                  className="rounded-md"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="font-medium">{vietnamCurrency(item.salePrice)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleUpdateQuantity(item.id.toString(), -1)}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                  <span className="font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleUpdateQuantity(item.id.toString(), 1)}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(item.id.toString())}
                  >
                    <TrashIcon className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{vietnamCurrency(calculateTotal())}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{vietnamCurrency(calculateTotal())}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="mt-6">
            {/* <CheckoutForm user={undefined} /> */}
          </div>
        </div>
      </div>

      {/* <Alert
        title="Remove item"
        description="Are you sure you want to remove this item from your order?"
        onConfirm={handleConfirmRemove}
        onCancel={() => setIsAlertOpen(false)}
        open={isAlertOpen}
        setOpen={setIsAlertOpen}
      /> */}
    </div>
  );
}