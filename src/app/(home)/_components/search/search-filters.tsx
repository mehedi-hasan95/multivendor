"use client";
import { useTRPC } from "@/trpc/client";
import { HomeCategory } from "./home-category";
import { SearchInput } from "./search-input";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { BreadcrumbNavigation } from "./breadcrumb-navigateion";

export const SearchFilters = () => {
  const trpc = useTRPC();
  const { data: categories } = useSuspenseQuery(
    trpc.categories.getMany.queryOptions()
  );
  const params = useParams();
  const categoryParam = params.category as string | undefined;
  const activeCategory = categoryParam || "all";

  const activeCategoryData = categories.find(
    (category) => category.slug === activeCategory
  );
  const activeCategoryName = activeCategoryData?.name;
  const activeSubCategory = params.subcategory as string | undefined;
  const activeSubCategoryName =
    activeCategoryData?.SubCategories.find(
      (subcat) => subcat.slug === activeSubCategory
    )?.name || null;
  return (
    <div className="px-4 lg:px-12 py-3 flex flex-col gap-3 pb-10">
      <SearchInput categories={categories} />
      <div className="hidden lg:flex">
        <HomeCategory categories={categories} />
      </div>
      <BreadcrumbNavigation
        activeCategory={activeCategory}
        activeCategoryName={activeCategoryName}
        subCategoryName={activeSubCategoryName}
      />
    </div>
  );
};
