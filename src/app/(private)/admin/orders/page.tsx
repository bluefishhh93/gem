import { Breadcrumb } from "@/components/Breadcrumb";
import { OrdersTable } from "./orders-table";

export interface OrderType {
    id: number;
    userId: number;
    name: string;
    email: string;
    phone: string;
    createAt: Date;
    total: number;
    orderStatus: "pending" | "processing" | "shipped" | "delivered" | "canceled" | null;
    shippingStatus: "pending" | "processing" | "shipped" | "delivered" | "canceled" | null;
    paymentStatus: "pending" | "processing" | "shipped" | "delivered" | "canceled" | null;
    shipAddress: string | null;
    shipDate: Date | null;
    paymentMethod: string | null;
    orderItems: {
        quantity: number;
        subtotal: number;
        product: {
            id: number;
            name: string;
            price: number;
        };
    }[];


}

export default function Page() {

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Breadcrumb items={[{ label: "Dashboard", link: "/admin" }, { label: "Orders" }]} />
            </div>
            <OrdersTable />
        </div>
    )
}   