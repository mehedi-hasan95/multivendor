"use client";
import { Input } from "@/components/ui/input";
import { ListFilterIcon, Search } from "lucide-react";
import { CategoriesSidebar } from "./categories-sidebar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { categoriesGetManyOutput } from "@/constants/trpc.types";
import { useProductFilters } from "../hooks/use-product-filter";

interface Props {
  disabled?: boolean;
  categories: categoriesGetManyOutput;
}
export const SearchInput = ({ disabled }: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [filters, setFilters] = useProductFilters();
  const [searchValue, setSearchValue] = useState(filters.search);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters({ search: searchValue });
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchValue, setFilters]);
  return (
    <div className="flex items-center w-full gap-2 ">
      <CategoriesSidebar onOpenChange={setIsSidebarOpen} open={isSidebarOpen} />
      <div className="relative w-full">
        <Search className="absolute top-1/2 -translate-y-1/2 left-3 size-4" />
        <Input
          disabled={disabled}
          placeholder="Search here"
          className="pl-8"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
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
