import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  items?: number;
}
export const LoadingSkeleton = ({ items = 4 }: LoadingSkeletonProps) => {
  return (
    <div className="flex flex-col gap-4 px-4 lg:px-12">
      <div className="flex flex-wrap  space-x-3 space-y-12">
        {Array.from({ length: items }).map((_, index) => (
          <Skeleton key={index} className="aspect-video w-2xs" />
        ))}
      </div>
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
