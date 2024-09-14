import { MAX_UPLOAD_IMAGE_SIZE, MAX_UPLOAD_IMAGE_SIZE_IN_MB } from "@/app-config";
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
