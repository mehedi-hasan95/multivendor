"use client";
import { Input } from "@/components/ui/input";
import { CategoriesType } from "@/constants/types";
import { ListFilterIcon, Search } from "lucide-react";
import { CategoriesSidebar } from "./categories-sidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  disabled?: boolean;
  categories: CategoriesType[];
}
export const SearchInput = ({ disabled, categories }: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  return (
    <div className="flex items-center w-full gap-2 ">
      <CategoriesSidebar
        categories={categories}
        onOpenChange={setIsSidebarOpen}
        open={isSidebarOpen}
      />
      <div className="relative w-full">
        <Search className="absolute top-1/2 -translate-y-1/2 left-3 size-4" />
        <Input disabled={disabled} placeholder="Search here" className="pl-8" />
      </div>
      <Button
        variant={"elevated"}
        onClick={() => setIsSidebarOpen(true)}
        className="flex shrink-0 lg:hidden"
      >
        <ListFilterIcon />
      </Button>
    </div>
  );
};
