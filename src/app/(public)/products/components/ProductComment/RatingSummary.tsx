import React from "react";
import { StarIcon } from "lucide-react";
//font
interface RatingSummaryProps {
  averageRating: number;
}

export const RatingSummary: React.FC<RatingSummaryProps> = ({ averageRating }) => {
  return (
    <div className="mb-6 text-center">
      <div className="flex justify-center items-center mb-2">
        <div className="text-4xl font-bold text-secondary-300 mr-2">{averageRating.toFixed(1)}</div>
        <div className="text-xl font-semibold text-secondary-400">/ 5</div>
      </div>
      <div className={` text-sm text-gray-500 mb-2`}>Đánh giá trung bình</div>
      <div className="flex justify-center mt-1 space-x-1">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`h-4 w-4 ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
};
