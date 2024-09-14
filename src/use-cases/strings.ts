import { createString, deleteString, getStringById, getStrings, updateString } from "@/data-access/strings";
import { UserSession } from "./types";
import { String } from "@/db/schema";
import { validateImage } from "@/util/util";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function createStringUseCase(
  authenticatedUser: UserSession,
  { color, material, price, stock, stringImage }: {
    color: string;
    material: string;
    price: number;
    stock: number;
    stringImage: File;
  }
) {
  validateImage(stringImage);
  const { secure_url: imageUrl } = await uploadToCloudinary(stringImage, {
    folder: 'strings',
  });
  return createString({ color, material, price, stock, imageUrl });
}

export async function getStringsUseCase() {
  const strings = await getStrings();
  return strings;
}

export async function deleteStringUseCase(
  authenticatedUser: UserSession,
  stringId: number
) {
  return deleteString(stringId);
}

export async function updateStringUseCase(
  authenticatedUser: UserSession,
  { id, ...updateData }: {
    id: number;
    color?: string;
    material?: string;
    price?: number;
    stock?: number;
    imageUrl?: string;
  }
) {
  return updateString(id, updateData);
}