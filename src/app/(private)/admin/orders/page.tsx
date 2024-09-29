import { Breadcrumb } from "@/components/Breadcrumb";
import { OrdersTable } from "./orders-table";
import { OrderStatus, PaymentStatus, ShippingStatus } from "@/types/enums";

export interface OrderType {
    id: number;
    userId: number;
    name: string;
    email: string;
    phone: string;
    createdAt: Date;
    total: number;
    orderStatus: OrderStatus;
    shippingStatus: ShippingStatus;
    paymentStatus: PaymentStatus;
    shipAddress: string;
    shipDate: Date | null;
    paymentMethod: string;
    orderItems: {
        id: number;
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
            string: {
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