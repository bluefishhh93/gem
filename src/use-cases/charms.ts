import { createCharm, deleteCharm, getCharmById, getCharms, updateCharm } from "@/data-access/charms";
import { UserSession } from "./types";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";
import { validateImage } from "@/util/util";
import { Charm } from "@/db/schema";


export async function createCharmUseCase(
  authenticatedUser: UserSession,
  { name, price, stock, charmImage }: {
    name: string;
    price: number;
    stock: number;
    charmImage: File;
  }
) {
  validateImage(charmImage);
  const { secure_url: imageUrl } = await uploadToCloudinary(charmImage, {
    folder: 'charms',
  });
  return createCharm({ name, price, stock, imageUrl });
}

export async function getCharmsUseCase() {
  const charms = await getCharms();
  return charms;
}

export async function deleteCharmUseCase(id: number) {
  const charm = await getCharmById(id);
  if (!charm) {
      throw new Error("Charm not found");
  }

  if (charm.imageUrl) {
      await deleteFromCloudinary(charm.imageUrl);
  }

  return deleteCharm(id);
}


export async function updateCharmUseCase(
  authenticatedUser: UserSession,
  { id, name, price, stock, imageUrl }: {
    id: number;
    name: string;
    price: number;
    stock: number;
    imageUrl?: string;
  }
) {
  const updateData: Partial<Charm> = { id, name, price, stock, imageUrl };
  return updateCharm(id, updateData);
}

