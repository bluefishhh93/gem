import { NewOrder, NewOrderItem, orderItems, orders, products } from "@/db/schema";
import { database } from "@/db";
import { eq, sql } from "drizzle-orm";

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