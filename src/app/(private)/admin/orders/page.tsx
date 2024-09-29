import { Breadcrumb } from "@/components/Breadcrumb";
import { OrdersTable } from "./orders-table";

export interface OrderType {
    id: number;
    userId: number;
    name: string;
    email: string;
    phone: string;
    createdAt: Date;
    total: number;
    orderStatus: "pending" | "processing" | "canceled" | "cancelling" | "completed" | null;
    shippingStatus: "pending" | "processing" | "shipping" | "delivered" | "failed" | null;
    paymentStatus: "pending" | "paid" | "refunded" | "failed" | null;
    shipAddress: string;
    shipDate: Date | null;
    paymentMethod: string;
    orderItems: {
        quantity: number;
        subtotal: number;
        product?: {
            id: number;
            name: string;
            price: number;
            imgProducts: {imageUrl: string, publicId: string}[];
        };
        customBracelet?: {
            id: number;
            totalPrice: number;
            charms: {
                id: number;
                name: string;
                imageUrl: string;
                position: number;
            }[];
            stringType: {
                material: string;
                color: string;
                imageUrl: string;
            };
        };
        isRated: boolean;
        isCustomBracelet: boolean;
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