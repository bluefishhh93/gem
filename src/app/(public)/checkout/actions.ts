"use server";

import { PaymentError, VNPayError } from "@/app/util";
import { authenticatedAction, unauthenticatedAction } from "@/lib/safe-action";
import vnpay from "@/lib/vnpay";
import { createOrderUseCase } from "@/use-cases/orders";
import moment from "moment";
import { redirect } from "next/navigation";
import { parse } from 'querystring';
import { ReturnQueryFromVNPay } from "vnpay";

import { z } from "zod";



const vnpayReturnSchema = z.object({
  vnp_Amount: z.string(),
  vnp_BankCode: z.string(),
  vnp_BankTranNo: z.string(),
  vnp_CardType: z.string(),
  vnp_OrderInfo: z.string(),
  vnp_PayDate: z.string(),
  vnp_ResponseCode: z.string(),
  vnp_TmnCode: z.string(),
  vnp_TransactionNo: z.string(),
  vnp_TransactionStatus: z.string(),
  vnp_TxnRef: z.string(),
  vnp_SecureHash: z.string(),
});

const checkoutFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  phone: z.string().trim().min(1, "Phone is required").regex(/^\d{10}$/, "Phone number is invalid"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  userId: z.number().optional(),
  address: z.string().trim().min(1, "Address is required"),
  ward: z.string().trim().min(1, "Ward is required"),
  district: z.string().trim().min(1, "District is required"),
  orderItems: z.array(z.object({
    productId: z.number(),
    quantity: z.number(),
    subtotal: z.number(),
  })),
});


export const checkoutWithCOD = unauthenticatedAction
  .createServerAction()
  .input(checkoutFormSchema)
  .handler(async ({ input }) => {
    console.log(input);

    const order = await createOrderUseCase(input);
    return { success: true, redirectUrl: `/checkout/success?orderId=${order.id}` };
  });

export const checkoutWithVNPay = unauthenticatedAction
  .createServerAction()
  .input(checkoutFormSchema)
  .handler(async ({ input }) => {
    try {
      const totalAmount = input.orderItems.reduce((acc, item) => acc + item.subtotal, 0);
      const date = new Date();
      const orderId = moment(date).format("DDHHmmss");
      const vnpayUrl = vnpay.buildPaymentUrl({
        vnp_Amount: totalAmount,
        vnp_IpAddr: '127.0.0.1', // You might want to get the actual IP address
        vnp_TxnRef: orderId,
        vnp_OrderInfo: `Payment for order ${orderId}`,
        vnp_ReturnUrl: `${process.env.HOST_NAME}/vnpay-return`,
      });

      return { success: true, redirectUrl: vnpayUrl };
    } catch (error) {
      console.error("VNPay checkout failed:", error);
      return { success: false, error: "Failed to initiate VNPay payment" };
    }
  });

function ensureString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] || '';
  return value || '';
}

export const finalizeVNPayPaymentAction = unauthenticatedAction
  .createServerAction()
  .input(z.object({
    queryString: z.string(),
    checkoutData: checkoutFormSchema,
  }))
  .handler(async ({ input }) => {
    try {
      const parsedQuery = parse(input.queryString);
      const vnpayReturn: ReturnQueryFromVNPay = {
        vnp_Amount: ensureString(parsedQuery.vnp_Amount),
        vnp_BankCode: ensureString(parsedQuery.vnp_BankCode),
        vnp_BankTranNo: ensureString(parsedQuery.vnp_BankTranNo),
        vnp_CardType: ensureString(parsedQuery.vnp_CardType),
        vnp_OrderInfo: ensureString(parsedQuery.vnp_OrderInfo),
        vnp_PayDate: ensureString(parsedQuery.vnp_PayDate),
        vnp_ResponseCode: ensureString(parsedQuery.vnp_ResponseCode),
        vnp_TmnCode: ensureString(parsedQuery.vnp_TmnCode),
        vnp_TransactionNo: ensureString(parsedQuery.vnp_TransactionNo),
        vnp_TransactionStatus: ensureString(parsedQuery.vnp_TransactionStatus),
        vnp_TxnRef: ensureString(parsedQuery.vnp_TxnRef),
        vnp_SecureHash: ensureString(parsedQuery.vnp_SecureHash)
      };


      const paymentResult = vnpay.verifyReturnUrl(vnpayReturn);

      if (!paymentResult.isVerified) {
        throw new VNPayError();
      } else if (vnpayReturn.vnp_ResponseCode === '24') {
        console.log('redirect to checkout', vnpayReturn.vnp_ResponseCode);
        return { success: false, redirectUrl: '/checkout' };
      } else if (!paymentResult.isSuccess) {
        throw new PaymentError();
      }
      const order = await createOrderUseCase({
        ...input.checkoutData,
        trackingNumber: vnpayReturn.vnp_TxnRef,
        paymentMethod: 'vnpay',
      });

      if (order) {
        return { success: true, redirectUrl: `/checkout/success?orderId=${order.id}` };
      } else {
        throw new Error("Failed to create order");
      }

    } catch (error) {
      console.error("Payment finalization failed:", error);
      return { success: false, error: error instanceof Error ? error.message : "Failed to finalize payment" };
    }
  });