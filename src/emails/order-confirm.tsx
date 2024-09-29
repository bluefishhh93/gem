import * as React from "react";

import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { env } from "@/env";
import { applicationName } from "@/app-config";
import { Order, OrderItem } from "@/db/schema";
import { vietnamCurrency } from "@/util/util";
import { OrderType } from "@/app/(private)/admin/orders/page";

export const BASE_URL = env.HOST_NAME;

export function OrderConfirmationEmail({ order }: { order: OrderType }) {
  const previewText = `Order Confirmation for Order #${order.id}`;
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`${BASE_URL}/gem-removebg.png`}
                width="160"
                height="48"
                alt={applicationName}
                className="mx-auto my-0"
              />
            </Section>

            <Section className="mb-[32px] mt-[32px] text-center">
              <Text className="text-[24px] font-bold leading-[24px] text-black">
                Order Confirmation
              </Text>
              <Text className="mb-8 text-[14px] leading-[24px] text-black">
                Thank you for your order! We&apos;re excited to confirm that your order has been received and is being processed.
              </Text>
            </Section>

            <Section className="mb-[32px]">
              <Text className="text-[18px] font-bold leading-[24px] text-black">
                Order Details
              </Text>
              <Text className="text-[14px] leading-[24px] text-black">
                <strong>Order Number:</strong> #{order.id}
              </Text>
              <Text className="text-[14px] leading-[24px] text-black">
                <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
              </Text>
            </Section>

            <Section className="mb-[32px]">
              <Text className="text-[18px] font-bold leading-[24px] text-black">
                Items Ordered
              </Text>
              {order.orderItems.map((item, index) => (
                <Text key={index} className="text-[14px] leading-[24px] text-black">
                  {item.product ? item.product?.name : `Custom Bracelet #${item.customBracelet?.id}`} - 
                  Quantity: {item.quantity} - 
                  Subtotal: {vietnamCurrency(item.subtotal)}
                </Text>
              ))}
            </Section>

            <Section className="mb-[32px]">
              <Text className="text-[18px] font-bold leading-[24px] text-black">
                Total: {vietnamCurrency(order.total)}
              </Text>
            </Section>

            <Section className="mb-[32px]">
              <Text className="text-[18px] font-bold leading-[24px] text-black">
                Shipping Details
              </Text>
              <Text className="text-[14px] leading-[24px] text-black">
                <strong>Name:</strong> {order.name}
              </Text>
              <Text className="text-[14px] leading-[24px] text-black">
                <strong>Address:</strong> {order.shipAddress}
              </Text>
            </Section>

            <Section className="mb-[32px] text-center">
              <Link
                href={`${BASE_URL}/dashboard/purchase`}
                target="_blank"
                className="bg-[#2754C5] text-white px-6 py-3 rounded text-[14px] font-medium no-underline"
              >
                View Order Status
              </Link>
            </Section>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

            <Text className="text-center text-[12px] leading-[24px] text-[#666666]">
              © 2024 {applicationName}. All rights reserved.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}