import { braceletCharms, charms, customBracelets, NewOrder, NewOrderItem, Order, orderItems, orders, products, strings } from "@/db/schema";
import { database } from "@/db";
import { desc, eq, sql } from "drizzle-orm";
import { OrderStatus, PaymentStatus, ShippingStatus } from "@/types/enums";
import { CustomBracelet } from "@/hooks/use-cart-store";

interface CustomBraceletData {
  id: number;
  orderId: number;
  stringId: number;
  price: number;
  quantity: number;
  charms: {
    id: number;
    position: number;
  }[];
}

export async function createOrder({
  orderData,
  orderItemsData,
  customBraceletData
}: {
  orderData: NewOrder,
  orderItemsData?: NewOrderItem[],
  customBraceletData?: CustomBraceletData[]
}) {
  return await database.transaction(async (tx) => {
    const [newOrder] = await tx.insert(orders).values(orderData).returning();

    if (orderItemsData?.length) {
      await Promise.all(orderItemsData.map(async (item) => {
        await tx.insert(orderItems).values({ ...item, orderId: newOrder.id });
        await tx
          .update(products)
          .set({ currentQuantity: sql`${products.currentQuantity} - ${item.quantity}` })
          .where(eq(products.id, item.productId as number));
      }));
    }

    if (customBraceletData?.length) {
      await Promise.all(customBraceletData.map(async (item) => {
        const customBracelet = await handleCustomBracelet(tx, newOrder.id, item);
        // Create an order item for the custom bracelet
        await tx.insert(orderItems).values({
          orderId: newOrder.id,
          productId: null, 
          customBraceletId: customBracelet.id,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
          isCustomBracelet: true,
        });
      }));
    }

    return newOrder;
  });
}

async function handleCustomBracelet(tx: any, orderId: number, customBraceletData: CustomBraceletData) {
  const [newCustomBracelet] = await tx.insert(customBracelets).values({
    id: customBraceletData.id,
    orderId,
    stringId: customBraceletData.stringId,
    price: customBraceletData.price,
    totalPrice: customBraceletData.price * customBraceletData.quantity
  }).returning();

  if (customBraceletData.charms.length) {
    await tx.insert(braceletCharms).values(
      customBraceletData.charms.map(charm => ({
        customBraceletId: newCustomBracelet.id,
        charmId: charm.id,
        position: charm.position
      }))
    );
  }

  await tx
    .update(strings)
    .set({ stock: sql`${strings.stock} - ${customBraceletData.quantity}` })
    .where(eq(strings.id, customBraceletData.stringId));

  await Promise.all(customBraceletData.charms.map(charm =>
    tx
      .update(charms)
      .set({ stock: sql`${charms.stock} - ${customBraceletData.quantity}` })
      .where(eq(charms.id, charm.id))
  ));

  return newCustomBracelet;
}

export async function getOrderById(id: number) {
  const order = await database.query.orders.findFirst({
    where: eq(orders.id, id),       
    with: {
      orderItems: {
        with: {
          product: true,
          customBracelet: true,
        }
      },

    }
  });
  console.log(order);

  return order;
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