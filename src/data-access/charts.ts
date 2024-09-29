import { database } from "@/db";
import { orders, users, products, orderItems, categories } from "@/db/schema";
import { OrderStatus } from "@/types/enums";
import { and, count, desc, eq, gte, lt, lte, sql } from "drizzle-orm";

export async function getTodayTotalOrders() {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const [data] = await database.select({ count: count()}).from(orders).where(and(gte(orders.createdAt, startOfDay), lte(orders.createdAt, endOfDay)));
    return data;
}




export async function getTodayTotalIncome() {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const [data] = await database.select({ count: count()}).from(orders)
        .where(and(gte(orders.createdAt, startOfDay),
            lte(orders.createdAt, endOfDay),

            eq(orders.orderStatus, OrderStatus.COMPLETED)));
    return data;
}

export async function getTodayNewCustomers() {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const [data] = await database.select({ count: count()}).from(users).where(and(gte(users.createdAt, startOfDay), lte(users.createdAt, endOfDay)));
    return data;
}

export async function getTotalOutstockProducts() {
    const [data] = await database.select({ count: count()}).from(products).where(lte(products.currentQuantity, 3));
    return data;
}


export async function getTotalPendingOrders() {
    const [data] = await database.select({ count: count()}).from(orders).where(eq(orders.orderStatus, 'pending'));
    return data;
}



export async function getTopSellingProducts() {
    const result = await database
    .select({
      productName: products.name,
      sales: sql<number>`sum(${orderItems.quantity})`.as('total_quantity'),
    })
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id))
    .groupBy(products.id, products.name)
    .orderBy(desc(sql`sum(${orderItems.quantity})`))
    .limit(5);

  return result.map(({ productName, sales }) => ({
    product: productName,
    sales: Number(sales), // Ensure sales is a number
  }));
  }
  
  export async function getSalesByCategory() {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
    const result = await database
      .select({
        categoryId: products.categoryId,
        categoryName: categories.name,
        itemsSold: sql<number>`sum(${orderItems.quantity})`.as('items_sold'),
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(
        and(
          gte(orders.createdAt, firstDayOfMonth),
          lte(orders.createdAt, lastDayOfMonth)
        )
      )
      .groupBy(products.categoryId, categories.name)
      .orderBy(desc(sql`sum(${orderItems.quantity})`))
      .limit(5);
  
    return result.map(({ categoryId, categoryName, itemsSold }) => ({
      categoryId,
      category: categoryName,
      sales: Number(itemsSold), // Convert to number in case it's returned as a string
    }));
  }
  
  export async function getMonthlyRevenue() {
    const result = await database
    .select({
      month: sql<string>`to_char(${orders.createdAt}, 'Month')`.as('month'),
      revenue: sql<number>`sum(${orders.total})`.as('revenue'),
    })
    .from(orders)
    .groupBy(sql`to_char(${orders.createdAt}, 'Month')`)
    .orderBy(sql`to_char(${orders.createdAt}, 'Month')`)
    .limit(6);

  return result.map(({ month, revenue }) => ({
    month: month.trim(), // Remove any trailing spaces
    revenue: Number(revenue), // Ensure revenue is a number
  }));
  }