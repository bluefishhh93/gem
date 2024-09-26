import { database } from "@/db";
import { ImgReview, imgReviews, NewReview, reviews } from "@/db/schema";
import { eq, gt, and, sql } from "drizzle-orm";

export async function saveReview({reviewData, imgReviewData} :{
    reviewData: NewReview;
    imgReviewData: ImgReview[];
}) {
  const [result] = await database.insert(reviews).values(reviewData).returning();
  
  if (imgReviewData && imgReviewData.length > 0) {
    await database.insert(imgReviews)
      .values(imgReviewData.map(imgReview => ({ ...imgReview, reviewId: result.id })))
      .$dynamic()
      .execute();
  }

  return result;
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
