import { uploadMultipleToCloudinary } from "@/lib/cloudinary";
import { validateImage } from "@/util/util";
import { createReview, deleteReview } from "@/data-access/reviews";

export async function getProductReviews(productId: number, page: number = 1, limit: number = 10) {
  return await getProductReviews(productId, page, limit);
}


export async function createReviewUseCase({
  userId,
  orderItemId,
  productId,
  rating,
  comment,
  images
}: {
  userId: number;
  orderItemId: number;
  productId: number;
  rating: number;
  comment?: string;
  images: File[];
}) {
  let uploadedImages: {imageUrl: string, publicId: string}[] = [];
  if(images.length > 0){
    for(const image of images){
      validateImage(image);
    }
    const cloudinaryImages = await uploadMultipleToCloudinary(images, {
      folder: "reviews"
    });

    uploadedImages = cloudinaryImages.map((img) => ({
      imageUrl: img.secure_url,
      publicId: img.public_id
    }))
  }

  return createReview({
    userId,
    orderItemId,
    productId,
    rating,
    comment,
    images: uploadedImages
  });
}

export async function deleteReviewUseCase(reviewId: number) {
  return await deleteReview(reviewId);
}
