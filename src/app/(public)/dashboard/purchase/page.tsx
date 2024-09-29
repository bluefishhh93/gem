import { Breadcrumb } from "@/components/Breadcrumb";
import { getCurrentUser } from "@/lib/session"
import { redirect } from "next/navigation";
import { OrderWrapper } from "./order-wrapper";
import { getOrdersByUserUseCase } from "@/use-cases/orders";

export default async function PurchasePage() {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login");
    }

    const orders = await getOrdersByUserUseCase(user.id);
    console.log(orders[0].orderItems);
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Breadcrumb items={[{ label: "Trang chủ", link: "/" }, { label: "Lịch sử mua hàng" }]} />
            {/* <h1 className="text-xl sm:text-3xl font-bold mt-4 mb-6">Lịch sử mua hàng</h1> */}
            <OrderWrapper userId={user.id} orders={orders as any} />
        </div>
    );
}