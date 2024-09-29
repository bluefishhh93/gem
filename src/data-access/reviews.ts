import { database } from "@/db";
import { ImgReview, imgReviews, NewReview, orderItems, reviews } from "@/db/schema";
import { eq, gt, and, sql } from "drizzle-orm";

export async function createReview({
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
  images: { imageUrl: string, publicId: string }[];
}) {
  return await database.transaction(async (tx) => {
    const [review] = await tx.insert(reviews).values({
      userId,
      orderItemId,
      productId,
      rating,
      comment,
    }).returning();

    if (images.length > 0) {
      const imgReviewsData = images.map((image) => ({
        ...image,
        reviewId: review.id
      }));

      await tx.insert(imgReviews).values(imgReviewsData);
    }

    // Update the isRated field for the corresponding order item
    await tx.update(orderItems)
      .set({ isRated: true })
      .where(eq(orderItems.id, orderItemId));

    return review;
  });
}

export async function getProductReviews(productId: number, page: number = 1, limit: number = 10) {
  const offset = (page - 1) * limit;

  const result = await database.query.reviews.findMany({
    where: eq(reviews.productId, productId),
    with: {
      user: true,
      imgReviews: true
    },
    limit: limit,
    offset: offset,
    orderBy: (reviews, { asc }) => [asc(reviews.createdAt), asc(reviews.id)]
  });

  const totalReviews = await database.select({ count: sql<number>`count(*)` }).from(reviews).where(eq(reviews.productId, productId));
  const totalCount = totalReviews[0]?.count ?? 0;

  return {
    reviews: result,
    totalCount: totalCount,
    totalPages: Math.ceil(totalCount / limit)
  };
}

export async function deleteReview(reviewId: number) {
  return await database.transaction(async (tx) => {
    // First, check if the review exists
    const existingReview = await tx.query.reviews.findFirst({
      where: eq(reviews.id, reviewId),
      with: {
        imgReviews: true
      }
    });

    if (!existingReview) {
      throw new Error("Review not found");
    }

    // Delete associated image reviews
    if (existingReview.imgReviews.length > 0) {
      await tx.delete(imgReviews).where(eq(imgReviews.reviewId, reviewId));
    }

    // Delete the review
    const [deletedReview] = await tx.delete(reviews)
      .where(eq(reviews.id, reviewId))
      .returning();

    return deletedReview;
  });
}
