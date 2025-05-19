import { Input } from "@/components/ui/input";

export const LoadingSkeleton = () => {
  return (
    <div className="px-4 lg:px-12">
      <Input disabled />
      <div>
        <div className="h-40" />
      </div>
    </div>
  );
};
