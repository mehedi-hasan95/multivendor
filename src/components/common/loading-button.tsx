import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const LoadingButton = () => {
  return (
    <Button
      disabled
      className=" w-full bg-slate-400/50 hover:bg-slate-600/50 text-white"
    >
      <Loader2 className="animate-spin" />
      Please Wait...
    </Button>
  );
};
