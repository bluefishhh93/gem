import React from "react";
import { CommentItem } from "./CommentItem";
import { ReviewType } from "./ProductComment";
import { getCurrentUser } from "@/lib/session";
import { getProfile } from "@/data-access/profiles";

interface CommentListProps {
  comments: ReviewType[];
  onImageClick: (imageSrc: string) => void;
}

export const CommentList: React.FC<CommentListProps> = ({ comments, onImageClick }) => {
  // const user = await getCurrentUser();
  console.log(comments)
  return (
    <div className="space-y-6">
      {comments.map((comment, index) => (
        <React.Fragment key={comment.id}>
          {index > 0 && <hr className="border-gray-200" />}
          <CommentItem 
            // user={user}
            // isAdmin={isAdmin}
            comment={comment} 
            onImageClick={onImageClick} 
          />
        </React.Fragment>
      ))}
    </div>
  );
};