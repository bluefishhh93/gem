"use server";

import { calculateTotal, PaymentError, VNPayError } from "@/app/util";
import { CustomBracelet } from "@/hooks/use-cart-store";
import { calculateShippingFee } from "@/lib/ghn";
import { rateLimitByIp } from "@/lib/limiter";
import payos from "@/lib/payos";
import { authenticatedAction, unauthenticatedAction } from "@/lib/safe-action";
import vnpay from "@/lib/vnpay";
import { createOrderUseCase } from "@/use-cases/orders";
import { CheckoutRequestType, WebhookDataType, WebhookType } from "@payos/node/lib/type";
import moment from "moment";
import { revalidatePath } from "next/cache";
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

const customBraceletSchema = z.object({
  // id: z.number(),
  quantity: z.number(),
  price: z.number(),
  string: z.object({
    id: z.number(),
    material: z.string(),
    color: z.string(),
    price: z.number(),
    imageUrl: z.string(),
  }),
  charms: z.array(z.object({
    id: z.number(),
    name: z.string(),
    imageUrl: z.string(),
    price: z.number(),
    position: z.number(),
  })),
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
  fee: z.number(),
  orderItems: z.array(z.object({
    name: z.string().optional(),
    productId: z.number(),
    quantity: z.number(),
    subtotal: z.number(),
  })).optional(),
  districtId: z.number(),
  wardCode: z.string(),
  provinceId: z.number().optional(),
  customBracelets: z.array(customBraceletSchema).optional()
});

export const checkoutWithCOD = unauthenticatedAction
  .createServerAction()
  .input(checkoutFormSchema)
  .handler(async ({ input }) => {
    // await rateLimitByIp({key: 'order-cod', limit: 3, window: 30000});
    const order = await createOrderUseCase({orderData: input, customBracelets: input.customBracelets});
    return { success: true, redirectUrl: `/checkout/success?orderId=${order.id}` };
  });

export const checkoutWithVNPay = unauthenticatedAction
  .createServerAction()
  .input(checkoutFormSchema)
  .handler(async ({ input }) => {
    try {
      const totalAmount = calculateTotal(input.orderItems, input.customBracelets) + input.fee;
      if (totalAmount <= 0) {
        throw new Error("Total amount must be greater than zero");
      }
      const orderId = moment().format("DDHHmmss");
      const vnpayUrl = vnpay.buildPaymentUrl({
        vnp_Amount: totalAmount,
        vnp_IpAddr:  getClientIp(),
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
  return Array.isArray(value) ? value[0] || '' : value || '';
}

function getClientIp() {
  return '127.0.0.1'; // TODO: Get actual IP address
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
      const vnpayReturn: ReturnQueryFromVNPay = Object.fromEntries(
        Object.entries(parsedQuery).map(([key, value]) => [key, ensureString(value)])
      ) as ReturnQueryFromVNPay;

      const paymentResult = vnpay.verifyReturnUrl(vnpayReturn);

      if (!paymentResult.isVerified) {
        throw new VNPayError();
      } else if (vnpayReturn.vnp_ResponseCode === '24') {
        return { success: false, redirectUrl: '/checkout' };
      } else if (!paymentResult.isSuccess) {
        throw new PaymentError();
      }


     if (
      (input.checkoutData.orderItems && input.checkoutData.orderItems.length > 0) ||
      (input.checkoutData.customBracelets && input.checkoutData.customBracelets.length > 0)
     ) {
      const order = await createOrderUseCase({
        orderData: {
          ...input.checkoutData,
          trackingNumber: vnpayReturn.vnp_TxnRef,
          paymentMethod: 'vnpay',
        },
        customBracelets: input.checkoutData.customBracelets,
      });

      return order 
        ? { success: true, redirectUrl: `/checkout/success?orderId=${order.id}` }
        : { success: false, error: "Failed to create order" };
     }

      

    } catch (error) {
      console.error("Payment finalization failed:", error);
      return { success: false, error: error instanceof Error ? error.message : "Failed to finalize payment" };
    }
  });

export const calculateShippingFeeAction = unauthenticatedAction
  .createServerAction()
  .input(z.object({
    districtId: z.number(),
    wardCode: z.string(),
    weight: z.number(),
    length: z.number(),
    width: z.number(),
    height: z.number(),
  }))
  .handler(async ({ input }) => {
    const fee = await calculateShippingFee({
      to_district_id: input.districtId,
      to_ward_code: input.wardCode,
      weight: input.weight,
      length: input.length,
      width: input.width,
      height: input.height,
      insurance_value: 0, // Assuming default insurance value is 0 if not provided
    });
    revalidatePath('/checkout');
    return fee;
  });



  //payos
  export const checkoutWithPayos = unauthenticatedAction
  .createServerAction()
  .input(checkoutFormSchema)
  .handler(async ({ input }) => {
    try {
      const totalAmount = calculateTotal(input.orderItems, input.customBracelets) + input.fee;
      
      if (totalAmount <= 0) {
        throw new Error("Total amount must be greater than zero");
      }

      const orderId = moment().format("DDHHmmss");

      const orderItems = input.orderItems?.map((item) => ({
        name: item.name ?? item.productId.toString(),
        quantity: item.quantity,
        price: item.subtotal,
      })) ?? [];

      const customBraceletItems = input.customBracelets?.map((item) => ({
        name: `Vòng tay custom ${item.string.material}`,
        quantity: item.quantity,
        price: item.price,
      })) ?? [];

      const shippingFee = {
        name: 'Phí vận chuyển',
        quantity: 1,
        price: input.fee,
      };

      const body: CheckoutRequestType = {
        orderCode: Number(orderId),
        amount: totalAmount,
        returnUrl: `${process.env.HOST_NAME}/payos-return`,
        cancelUrl: `${process.env.HOST_NAME}/checkout`,
        description: `Pay order ${orderId}`,
        buyerName: input.name,
        items: [...orderItems, ...customBraceletItems, shippingFee],
      };

      console.log(body);
      const paymentLinkRes = await payos.createPaymentLink(body);

      return { 
        success: true, 
        redirectUrl: paymentLinkRes.checkoutUrl 
      };
    } catch (error) {
      console.error("Payos checkout failed:", error);
      return { 
        success: false, 
        error: "Failed to initiate Payos payment" 
      };
    }
  });

  export const finalizePayOSPaymentAction = unauthenticatedAction
  .createServerAction()
  .input(
    z.object({
      queryString: z.string(),
      checkoutData: checkoutFormSchema,
    })
  )
  .handler(async ({ input }) => {
    try {
      // Parsing the query string to get payment details
      const parsedQuery = parse(input.queryString);
      
      // Convert parsed query to WebhookType
      // const webhookData: WebhookType = {
      //   code: ensureString(parsedQuery.code),
      //   desc: ensureString(parsedQuery.desc),
      //   success: parsedQuery.success === 'true',
      //   data: JSON.parse(ensureString(parsedQuery.data)),
      //   signature: ensureString(parsedQuery.signature)
      // };

      // // Verify the webhook data
      // const verifiedData: WebhookDataType = payos.verifyPaymentWebhookData(webhookData);

      // // Check if verification was successful
      // if (!verifiedData) {
      //   throw new Error("Payment verification failed");
      // }

      // Handling the response based on status
      if (parsedQuery.code !== "00") {
        // Payment failed or canceled
        return { success: false, redirectUrl: "/checkout" };
      }

      // Assuming payment success, create the order
     if(
      (input.checkoutData.orderItems && input.checkoutData.orderItems.length > 0) ||
      (input.checkoutData.customBracelets && input.checkoutData.customBracelets.length > 0)
     ) {
      const order = await createOrderUseCase({
        orderData: {
          ...input.checkoutData,
          trackingNumber: parsedQuery.orderCode!.toString(),
          paymentMethod: 'payos'
        },
        customBracelets: input.checkoutData.customBracelets,
      });

      if(order) {
        return { success: true, redirectUrl: `/checkout/success?orderId=${order.id}` };
      }
     }
     return { success: false, redirectUrl: '/' };
    } catch (error) {
      console.error("Payment finalization failed:", error);
      return { success: false, error: error instanceof Error ? error.message : "Failed to finalize payment" };
    }
  });

