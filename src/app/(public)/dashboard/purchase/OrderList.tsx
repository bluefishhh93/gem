"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import OrderCard from "./OrderCard";
import { Spinner } from "@/components/spinner";

const ordersPerPage = 2;
interface OrderListProps {
  orders: any[];
  activeTab: string;
  isLoading: boolean;
}

const OrderList: React.FC<OrderListProps> = ({ orders, activeTab, isLoading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const filteredOrders = orders;
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <div className="container mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
      {isLoading ? (
        <div className="text-center py-8">
          <Spinner />
          <p className="mt-2">Loading orders...</p>
        </div>
      ) : currentOrders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">No {activeTab} orders found.</p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {currentOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {filteredOrders.length > ordersPerPage && (
        <div className="mt-6 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-full sm:w-auto"
          >
            Previous
          </Button>
          <span className="text-sm">Page {currentPage}</span>
          <Button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={indexOfLastOrder >= filteredOrders.length}
            className="w-full sm:w-auto"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default OrderList;