import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  items?: number;
  className?: string;
}
export const LoadingSkeleton = ({
  items = 4,
  className,
}: LoadingSkeletonProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3",
        className
      )}
    >
      {" "}
      {Array.from({ length: items }).map((_, index) => (
        <div
          key={index}
          className="border border-gray-800 rounded-lg p-4 shadow-lg animate-pulse bg-gray-900"
        >
          {/* Image skeleton */}
          <div className="w-full h-96 bg-gray-800 rounded mb-4"></div>

          {/* Title skeleton */}
          <div className="h-6 bg-gray-800 rounded mb-2 w-3/4"></div>

          {/* Description skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-800 rounded w-full"></div>
            <div className="h-4 bg-gray-800 rounded w-2/3"></div>
          </div>

          {/* Price skeleton */}
          <div className="h-6 bg-gray-800 rounded w-1/3"></div>
        </div>
      ))}
    </div>
  );
};

export const HomeSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 px-4 lg:px-12">
      <Input disabled />
      <div className="h-12" />
    </div>
  );
};
