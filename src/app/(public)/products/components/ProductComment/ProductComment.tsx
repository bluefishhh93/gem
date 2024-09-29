import React, { useEffect, useState, useCallback } from "react";
import { CommentList } from "./CommentList";
import { Pagination } from "./Pagination";
import { RatingSummary } from "./RatingSummary";
import { ImageOverlay } from "./ImageOverlay";
import { ProductType } from "@/hooks/use-cart-store";


export interface ReviewType {
  id: number;
  user: {
    id: number;
    role: "admin" | "user" | undefined;
    profile: {
      image: string;
      displayName: string;
    };
  };
  productId: number;
  rating: number;
  createdAt: string;
  comment: string;
  imgReviews: {
    imageUrl: string;
    publicId: string;
  }[];
};

const imgNotFoundUrl = process.env.NEXT_PUBLIC_IMG_NOTFOUND as string;

export default function ProductComment({ reviews, isAdmin = false }: { reviews: ReviewType[], isAdmin: boolean }) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const commentsPerPage = 3;
  const totalReviews = reviews.length || 0;

  const handlePageChange = useCallback((page: number): void => {
    setCurrentPage(page);
  }, []);

  const handleImageClick = useCallback((imageSrc: string): void => {
    setSelectedImage(imageSrc);
  }, []);

  const closeOverlay = useCallback((): void => {
    setSelectedImage(null);
  }, []);


  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, comment) => acc + comment.rating, 0) /
      reviews.length
      : 0;

  const totalPages = Math.ceil(totalReviews / commentsPerPage);

  return (
    <section className="p-4 md:p-6 mt-4 ">
      <div className="mx-auto max-w-2xl">
        {totalReviews > 0 ? (
          <>
            <div className="flex flex-col items-center justify-center">
            <h2 className={`mb-8 text-3xl font-extrabold text-primary-600 text-center`}>
              Đánh giá sản phẩm
            </h2>
            <RatingSummary averageRating={averageRating} />
            </div>
            <CommentList
              // isAdmin={isAdmin}
              comments={reviews}
              onImageClick={handleImageClick}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">No reviews yet.</p>
            <p className="mt-2 text-sm text-gray-500">Be the first to review this product!</p>
          </div>
        )}
      </div>

      {selectedImage && <ImageOverlay imageSrc={selectedImage} onClose={closeOverlay} />}
    </section>
  );
}