import { createString, deleteString, getStringById, getStrings, updateString } from "@/data-access/strings";
import { UserSession } from "./types";
import { String } from "@/db/schema";
import { validateImage } from "@/util/util";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";

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

export async function deleteStringUseCase(id: number) {
  const string = await getStringById(id);
  if (!string) {
      throw new Error("String not found");
  }

  if (string.imageUrl) {
      await deleteFromCloudinary(string.imageUrl);
  }

  return deleteString(id);
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