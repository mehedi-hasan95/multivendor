"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  disabled: boolean;
}

export function StarRating({
  rating = 0,
  onRatingChange,
  disabled,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div
      className={cn(
        "flex space-x-1",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="focus:outline-none"
          onClick={() => onRatingChange(star === rating ? 0 : star)} // Toggle off if clicking the same star
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          disabled={disabled}
        >
          <Star
            className={cn(
              `w-8 h-8 cursor-pointer transition-all ${
                star <= (hoverRating || rating)
                  ? "fill-amber-400 text-amber-400"
                  : "text-amber-400"
              }`,
              disabled && "cursor-not-allowed"
            )}
          />
          <span className="sr-only">{star} stars</span>
        </button>
      ))}
    </div>
  );
}
