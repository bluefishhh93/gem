"use client";

import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  ChevronDownIcon,
  PackageIcon,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import OrderItems from "./OrderItem";
import { OrderType } from "@/app/(private)/admin/orders/page";
import { updateOrderStatusAction } from "@/app/(private)/admin/orders/action";
import { useServerAction } from "zsa-react";
import { useToast } from "@/components/ui/use-toast"
import { cancelOrderAction } from "./actions";


const OrderCard: React.FC<{
  order: OrderType;
}> = ({ order }) => {
  const { toast } = useToast();
  const { execute, isPending } = useServerAction(cancelOrderAction, {
    onSuccess: () => {
      toast({
        title: "Thành công",

        //if order payment method is cod, then show "Đơn hàng đã được hủy"
        //if order payment method is vnpay, then show "Đơn hàng đã được yêu cầu hủy và hoàn lại tiền"
        description: order.paymentMethod === "cod" ? "Đơn hàng đã được hủy" : "Đơn hàng đã được yêu cầu hủy và hoàn lại tiền",
        variant: "success",
      });
    },
    onError: () => {
      toast({
        title: "Thất bại",
        description: "Có lỗi khi hủy đơn hàng",
        variant: "destructive",
      });
    }
  });


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border rounded-lg shadow-sm mb-4 overflow-hidden"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex justify-between p-3 bg-gray-50 dark:bg-slate-800">
        <div className="flex items-center space-x-2">
          <PackageIcon className="w-5 h-5 text-primary" />
          <p className="text-sm font-medium">Order #{order.id}</p>
        </div>
        <p className="text-xs text-muted-foreground">
          {format(new Date(order.createdAt), "MMM d, yyyy")}
        </p>
      </div>
      <div className="p-3">
        <Collapsible>
          <CollapsibleTrigger className="flex justify-between items-center w-full p-2 bg-muted hover:bg-accent transition-colors rounded mb-2">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Chi tiết đơn hàng</p>
            </div>
            <ChevronDownIcon className="w-4 h-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-4">
            <div className="flex justify-between items-start">
              <div className="w-1/2 space-y-1">
                <p className="text-sm font-medium mb-2">Thông tin giao hàng</p>
                <p className="text-xs text-muted-foreground"><span className="font-semibold">Tên:</span> {order.name}</p>
                <p className="text-xs text-muted-foreground"><span className="font-semibold">Email:</span> {order.email}</p>
                <p className="text-xs text-muted-foreground"><span className="font-semibold">Điện thoại:</span> {order.phone}</p>
                <p className="text-xs text-muted-foreground"><span className="font-semibold">Địa chỉ:</span> {order.shipAddress}</p>
                <p className="text-xs text-muted-foreground"><span className="font-semibold">Phương thức thanh toán:</span> {translatePaymentMethod(order.paymentMethod)}</p>
                <p className="text-xs text-muted-foreground"><span className="font-semibold">Trạng thái thanh toán:</span> {translatePaymentStatus(order.paymentStatus!)}</p>
                <p className="text-xs text-muted-foreground"><span className="font-semibold">Trạng thái giao hàng:</span> {translateShippingStatus(order.shippingStatus!)}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold mb-1">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(order.total)}
                </p>
                <p
                  className={`text-sm font-medium px-2 py-1 rounded-full ${getStatusColor(order.orderStatus!)
                    }`}
                >
                  {translateOrderStatus(order.orderStatus!)}
                </p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible>
          <CollapsibleTrigger className="flex justify-between items-center w-full p-2 bg-muted hover:bg-accent transition-colors rounded mt-2">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Sản phẩm đặt hàng</p>
            </div>
            <ChevronDownIcon className="w-4 h-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <OrderItems items={order.orderItems} status={order.orderStatus!} />
          </CollapsibleContent>
        </Collapsible>
        <p className="text-xs text-muted-foreground mt-2">
          Đặt hàng lúc: {format(new Date(order.createdAt), 'HH:mm - dd/MM/yyyy')}
        </p>
        <div className="mt-3 flex justify-end space-x-2">
          {order.orderStatus === "pending" && (
            <Button size="sm" variant="destructive" onClick={() => execute({ orderId: order.id })}>
              Hủy đơn
            </Button>
          )}
       
          {order.orderStatus === "cancelling" && (
            <Button disabled size="sm" variant="secondary">
              Đang yêu cầu hủy...
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default OrderCard;

// Helper functions for translations
function translatePaymentMethod(method: string): string {
  const translations: { [key: string]: string } = {
    'cod': 'Thanh toán khi nhận hàng',
    'vnpay': 'Thanh toán online',
    'paypal': 'PayPal',
    'cash': 'Tiền mặt',
    // Add more translations as needed
  };
  return translations[method] || method;
}

function translatePaymentStatus(status: string): string {
  const translations: { [key: string]: string } = {
    'pending': 'Chờ xử lý',
    'completed': 'Hoàn thành',
    'failed': 'Thất bại',
    // Add more translations as needed
  };
  return translations[status] || status;
}

function translateShippingStatus(status: string): string {
  const translations: { [key: string]: string } = {
    'pending': 'Chờ xử lý',
    'shipped': 'Đã gửi hàng',
    'delivered': 'Đã giao hàng',
    'canceled': 'Đã hủy',
    // Add more translations as needed
  };
  return translations[status] || status;
}

function translateOrderStatus(status: string): string {
  const translations: { [key: string]: string } = {
    'pending': 'Chờ xử lý',
    'processing': 'Đang xử lý',
    'shipped': 'Đã gửi hàng',
    'delivered': 'Đã giao hàng',
    'canceled': 'Đã hủy',
    // Add more translations as needed
  };
  return translations[status] || status;
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-indigo-100 text-indigo-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'canceled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

