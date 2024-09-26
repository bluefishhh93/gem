import { getTodayTotalIncome, getTodayTotalOrders, getTotalOutstockProducts, getTotalPendingOrders } from "@/data-access/charts";
import { getTopSellingProducts, getSalesByCategory, getMonthlyRevenue } from "@/data-access/charts";

export async function getMetricDataUseCase() {
    const totalOrders = await getTodayTotalOrders();
    const totalIncome = await getTodayTotalIncome();
    const pendingOrders = await getTotalPendingOrders();
    const totalOutstockProducts = await getTotalOutstockProducts();
    return { totalOrders: totalOrders.count, totalIncome: totalIncome.count, pendingOrders: pendingOrders.count, totalOutstockProducts: totalOutstockProducts.count };
}


export async function getTopSellingProductsUseCase() {
  const data = await getTopSellingProducts();
  return data;
}


export async function getSalesByCategoryUseCase() {
  const data = await getSalesByCategory();
  return data;
}


export async function getMonthlyRevenueUseCase() {
  const data = await getMonthlyRevenue();
  return data;
}