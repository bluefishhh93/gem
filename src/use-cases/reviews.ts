
export async function getProductReviews(productId: number, page: number = 1, limit: number = 10) {
  return await getProductReviews(productId, page, limit);
}

export async function saveReview({reviewData, imgReviewData} :{
    reviewData: {
        comment: string;
        rating: number;
        userId: number;
        productId: number;
        orderItemId: number;
    },
    imgReviewData: {
        imageUrl: string;
        publicId: string;
    }[];
}) {
  return await saveReview({reviewData, imgReviewData});
}
