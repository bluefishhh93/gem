"use server";

import { adminOnlyAction } from "@/lib/safe-action";
import { getMetricDataUseCase, getTopSellingProductsUseCase, getSalesByCategoryUseCase, getMonthlyRevenueUseCase } from "@/use-cases/charts";

export const getMetricDataAction = adminOnlyAction
  .createServerAction()
  .handler(async () => {
    return await getMetricDataUseCase();
  });

export const getTopSellingProductsAction = adminOnlyAction
  .createServerAction()
  .handler(async () => {
    return await getTopSellingProductsUseCase();
  });

export const getSalesByCategoryAction = adminOnlyAction
  .createServerAction()
  .handler(async () => {
    return await getSalesByCategoryUseCase();
  });

export const getMonthlyRevenueAction = adminOnlyAction
  .createServerAction()
  .handler(async () => {
    return await getMonthlyRevenueUseCase();
  });