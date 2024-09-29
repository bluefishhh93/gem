"use client";
import { OrderStatus } from "@/types/enums";
import TabButtons from "./TabButtons";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useState } from "react";
import OrderList from "./OrderList";
import { OrderType } from "@/app/(private)/admin/orders/page";

export function OrderWrapper({ userId, orders }: { userId: number , orders: OrderType[]}) {
    const [activeTab, setActiveTab] = useState<string>("pending");

  // This function will be called when a tab is clicked
  const handleTabChange = (newStatus: string) => {
    setActiveTab(newStatus);
    // You can add additional logic here, such as fetching data for the new tab
  };

  const pendingOrders = orders.filter(order => order.orderStatus === OrderStatus.PENDING);
  const shippingOrders = orders.filter(order => order.orderStatus === OrderStatus.PROCESSING);
  const completedOrders = orders.filter(order => order.orderStatus === OrderStatus.COMPLETED);
  const cancelledOrders = orders.filter(order => order.orderStatus === OrderStatus.CANCELED);


  return (
    <div className="container mx-auto p-4">
      
      <TabButtons activeTab={activeTab} setActiveTab={handleTabChange} />
      
      {/* Content area for each tab */}
      <div className="mt-4 w-full md:w-2/3 mx-auto p-4">
        {activeTab === "pending" && <OrderList orders={pendingOrders} activeTab={activeTab} isLoading={false} />}
        {activeTab === "shipping" && <OrderList orders={shippingOrders} activeTab={activeTab} isLoading={false} />}
        {activeTab === "completed" && <OrderList orders={completedOrders} activeTab={activeTab} isLoading={false} />}
        {activeTab === "cancelled" && <OrderList orders={cancelledOrders} activeTab={activeTab} isLoading={false} />}
      </div>
        </div>
    );
}
