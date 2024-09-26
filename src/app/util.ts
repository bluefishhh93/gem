import { CustomBracelet } from "@/hooks/use-cart-store";
import sanitizeHtml from "sanitize-html";

export const AUTHENTICATION_ERROR_MESSAGE =
  "You must be logged in to view this content";

export const PRIVATE_GROUP_ERROR_MESSAGE =
  "You do not have permission to view this group";

export const VNPAY_ERROR_MESSAGE =
  "Xác thực tính toàn vẹn dữ liệu không thành công";

export const PAYMENT_ERROR_MESSAGE =
  "Đơn hàng thanh toán không thành công";

export const INSUFFICIENT_PRODUCT_QUANTITY_ERROR_MESSAGE =
  "Sản phẩm hiện không có sẵn";

export const AuthenticationError = class AuthenticationError extends Error {
  constructor() {
    super(AUTHENTICATION_ERROR_MESSAGE);
    this.name = "AuthenticationError";
  }
};

export const InsufficientProductQuantityError = class InsufficientProductQuantityError extends Error {
  constructor() {
    super(INSUFFICIENT_PRODUCT_QUANTITY_ERROR_MESSAGE);
    this.name = "InsufficientProductQuantityError";
  }
};


export const VNPayError = class VNPayError extends Error {
  constructor() {
    super(VNPAY_ERROR_MESSAGE);
    this.name = "VNPayError";
  }
};

export const PaymentError = class PaymentError extends Error {
  constructor() {
    super(PAYMENT_ERROR_MESSAGE);
    this.name = "PaymentError";
  }
};

export const PrivateGroupAccessError = class PrivateGroupAccessError extends Error {
  constructor() {
    super(PRIVATE_GROUP_ERROR_MESSAGE);
    this.name = "PrivateGroupAccessError";
  }
};

export const NotFoundError = class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
};
export function sanitizeBlogContent(html: string): string {
  return sanitizeHtml(html);
}

export function stripHtmlTags(content: string): string {
  return content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}


export function createExcerpt(html: string, maxLength: number = 135): string {
  const cleanText = stripHtmlTags(html);

  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  const lastSpace = cleanText.lastIndexOf(' ', maxLength);
  const cutoff = lastSpace > -1 ? lastSpace : maxLength;

  return `${cleanText.substring(0, cutoff)}...`;
}

export function calculateReadingTime(content: string): number {
  const plainText = stripHtmlTags(sanitizeBlogContent(content));
  const words = plainText.split(/\s+/).length;
  const wordsPerMinute = 200;

  return Math.ceil(words / wordsPerMinute);
}

export function calculateTotal(orderItems?: {subtotal: number}[], customBracelets?: CustomBracelet[]): number {
  const itemsTotal = orderItems?.reduce((acc, item) => acc + item.subtotal, 0) ?? 0;
  const braceletTotal = customBracelets?.reduce((acc, bracelet) => acc + (bracelet.price * bracelet.quantity), 0) ?? 0;
  return itemsTotal + braceletTotal;
}