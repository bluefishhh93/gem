
import { MAX_UPLOAD_IMAGE_SIZE, MAX_UPLOAD_IMAGE_SIZE_IN_MB } from "@/app-config";
import { CartItemType, CustomBracelet, ProductType } from "@/hooks/use-cart-store";
import slugify from 'slugify';

interface Omit {
  <T extends object, K extends [...(keyof T)[]]>(obj: T, ...keys: K): {
    [K2 in Exclude<keyof T, K[number]>]: T[K2];
  };
}

export const omit: Omit = (obj, ...keys) => {
  const ret = {} as {
    [K in keyof typeof obj]: (typeof obj)[K];
  };
  let key: keyof typeof obj;
  for (key in obj) {
    if (!keys.includes(key)) {
      ret[key] = obj[key];
    }
  }
  return ret;
};


export function validateImage(image: File) {
  if (!image.type.startsWith("image/")) {
    throw new Error("Invalid image type");
  }
  if (image.size > MAX_UPLOAD_IMAGE_SIZE) {
    throw new Error(`File size too large. Max size is ${MAX_UPLOAD_IMAGE_SIZE_IN_MB}MB`);
  }
}

export function vietnamCurrency(price: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}


export function convertToSlug(title: string): string {
  // Remove diacritics and convert to lowercase
  const slug = slugify(title, {
    lower: true,      // convert to lower case
    strict: true,     // strip special characters except replacement
    locale: 'vi',     // language code of the locale to use
  });
  
  // Further clean up the slug
  return slug
    .replace(/[^\w\-]+/g, '')   // Remove any remaining non-word chars
    .replace(/\-\-+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')         // Trim - from start of text
    .replace(/-+$/, '');        // Trim - from end of text
}


export const getItemList = (cart: ProductType[]): CartItemType[] => {
  return cart.map((item: ProductType) => ({
      productId: item.id,
      quantity: item.quantity,
      subtotal: item.salePrice * item.quantity,
  }));
};

export const getCustomItemList = (cart: CustomBracelet[]) => {
  return cart.map((item: CustomBracelet) => ({
      productId: item.id,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
  }));
};

