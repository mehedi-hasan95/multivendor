import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

const MAX_RATING = 5;
const MIN_RATING = 0;
interface Props {
  rating: number;
  className?: string;
  iconClassName?: string;
  text?: string;
}
export const StarRating = ({
  rating,
  className,
  iconClassName,
  text,
}: Props) => {
  const safeRating = Math.max(MIN_RATING, Math.min(rating, MAX_RATING));
  return (
    <div className={cn("flex items-center gap-x-1", className)}>
      {Array.from({ length: MAX_RATING }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            "size-4",
            index < safeRating ? "fill-yellow-400 text-yellow-400" : "",
            iconClassName
          )}
        />
      ))}
      {text && <p>{text}</p>}
    </div>
  );
};
