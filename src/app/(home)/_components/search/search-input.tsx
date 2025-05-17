import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Props {
  disabled?: boolean;
}
export const SearchInput = ({ disabled }: Props) => {
  return (
    <div className="relative">
      <Search className="absolute top-1/2 -translate-y-1/2 left-3 size-4" />
      <Input disabled={disabled} placeholder="Search here" className="pl-8" />
    </div>
  );
};
