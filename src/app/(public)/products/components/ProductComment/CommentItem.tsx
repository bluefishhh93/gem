import React, { useState, useCallback } from "react";
import { MoreVertical, Star, StarIcon, Trash2 } from "lucide-react";
import { ImageGallery } from "./ImageGallary";
import { ReviewType } from "./ProductComment";
import { useServerAction } from "zsa-react";
import { deleteReviewAction } from "../../actions";
import { CommentItemUser } from "./comment-item-user";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
interface CommentItemProps {
  comment: ReviewType;
  onImageClick: (imageSrc: string) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, onImageClick }) => {
  const [showDelete, setShowDelete] = useState(false);
  const { execute, isPending } = useServerAction(deleteReviewAction);

  const handleDeleteClick = useCallback(() => {
    execute({ reviewId: comment.id, productId: comment.productId });
  }, [comment.id, comment.productId, execute]);

  return (
    <div className="flex gap-3 animate-fade-in p-4 rounded-md bg-slate-50 dark:bg-slate-800">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={comment.user.profile.image} alt={comment.user.profile.displayName} />
        <AvatarFallback>{comment.user.profile.displayName.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
            <div className="font-medium text-sm">{comment.user.profile.displayName}</div>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className={`h-3 w-3 ${i < comment.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <time dateTime={comment.createdAt}>{new Date(comment.createdAt).toLocaleDateString()}</time>
          {/* {isAdmin && (
            <div className="relative">
              <MoreVertical className="h-4 w-4 cursor-pointer" onClick={() => setShowDelete(!showDelete)} />
              {showDelete && (
                <button
                  className="absolute right-0 mt-1 p-1 bg-white shadow-md rounded-md flex items-center text-red-500 hover:bg-red-100"
                  onClick={handleDeleteClick}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  <span className="text-xs">Delete</span>
                </button>
              )}
            </div>
          )} */}
        </div>
        <div className="mt-1 text-xs leading-relaxed text-gray-700">{comment.comment}</div>
        <ImageGallery images={comment.imgReviews} onImageClick={onImageClick} />
      </div>
    </div>
  );
};