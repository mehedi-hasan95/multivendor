import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps {
  className?: string;
}
export const LoadingButton = ({ className }: LoadingButtonProps) => {
  return (
    <Button
      disabled
      className={cn(
        "w-full bg-slate-400/50 hover:bg-slate-600/50 text-white",
        className
      )}
    >
      <Loader2 className="animate-spin" />
      Please Wait...
    </Button>
  );
};
