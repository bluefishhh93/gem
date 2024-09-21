import { NewOrder, NewOrderItem, Order, orderItems, orders, products } from "@/db/schema";
import { database } from "@/db";
import { desc, eq, sql } from "drizzle-orm";
import { OrderStatus, PaymentStatus, ShippingStatus } from "@/types/enums";


export async function createOrder({orderData, orderItemsData}: {orderData: NewOrder, orderItemsData: NewOrderItem[]}) {


    return await database.transaction(async (tx) => {
        // Create the order
        const [newOrder] = await tx.insert(orders).values(orderData).returning();

        // Insert order items and decrease product quantity
        for (const item of orderItemsData) {
            await tx.insert(orderItems).values({
                ...item,
                orderId: newOrder.id
            });

            // Decrease product quantity
            await tx
                .update(products)
                .set({ currentQuantity: sql`${products.currentQuantity} - ${item.quantity}` })
                .where(eq(products.id, item.productId));
        }

        return newOrder;
    });
}

export async function getOrderById(id: number) {
    return await database.query.orders.findFirst({
        where: eq(orders.id, id),       
        with: {
            orderItems: {
                with: {
                    product: true,
                }
            },
        }
    })
}

export async function updateOrder(id: number, orderData: Partial<{
    orderStatus: OrderStatus;
    paymentStatus: PaymentStatus;
    shippingStatus: ShippingStatus;
}>) {
    return await database.update(orders).set(orderData).where(eq(orders.id, id));
}

export async function getOrders() {
    return await database.query.orders.findMany({
        orderBy: desc(orders.createdAt),
        with: {
            orderItems: {
                with: {
                    product: true,
                }
            },
        }
    });
}


