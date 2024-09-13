import { MAX_UPLOAD_IMAGE_SIZE, MAX_UPLOAD_IMAGE_SIZE_IN_MB } from "@/app-config";
import { createCharm, getCharmById, getCharms } from "@/data-access/charms";
import { UserSession } from "./types";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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
  const imageUrl = await uploadImageToCloudinary(charmImage);
  return createCharm({ name, price, stock, imageUrl });
}

export async function getCharmsUseCase() {
  const charms = await getCharms();
  return charms;
}

function validateImage(image: File) {
  if (!image.type.startsWith("image/")) {
    throw new Error("Invalid image type");
  }
  if (image.size > MAX_UPLOAD_IMAGE_SIZE) {
    throw new Error(`File size too large. Max size is ${MAX_UPLOAD_IMAGE_SIZE_IN_MB}MB`);
  }
}

async function uploadImageToCloudinary(image: File): Promise<string> {
  const buffer = await image.arrayBuffer();
  const uint8Array = new Uint8Array(buffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "charms" },
      (error, result) => {
        if (error) reject(new Error("Failed to upload image to Cloudinary"));
        else if (result && 'secure_url' in result) resolve(result.secure_url);
        else reject(new Error("Invalid response from Cloudinary"));
      }
    );
    uploadStream.end(uint8Array);
  });
}

