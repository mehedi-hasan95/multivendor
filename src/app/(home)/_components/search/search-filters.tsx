"use client";
import { useTRPC } from "@/trpc/client";
import { HomeCategory } from "./home-category";
import { SearchInput } from "./search-input";
import { useSuspenseQuery } from "@tanstack/react-query";

export const SearchFilters = () => {
  const trpc = useTRPC();
  const { data: categories } = useSuspenseQuery(
    trpc.categories.getMany.queryOptions()
  );
  return (
    <div className="px-4 lg:px-12 py-3 flex flex-col gap-3">
      <SearchInput categories={categories} />
      <div className="hidden lg:flex">
        <HomeCategory categories={categories} />
      </div>
    </div>
  );
};
