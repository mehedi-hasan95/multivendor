import { getCategoriesAction } from "@/action/admin";
import { HomeCategory } from "./home-category";
import { SearchInput } from "./search-input";

export const SearchFilters = async () => {
  const categories = await getCategoriesAction();
  return (
    <div className="px-4 lg:px-12 py-3 flex flex-col gap-3">
      <SearchInput categories={categories} />
      <div className="hidden lg:flex">
        <HomeCategory categories={categories} />
      </div>
    </div>
  );
};
