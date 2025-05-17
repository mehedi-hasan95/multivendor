import { HomeCategory } from "./home-category";
import { SearchInput } from "./search-input";

export const SearchFilters = () => {
  return (
    <div className="px-4 lg:px-12 py-3 flex flex-col gap-3">
      <SearchInput />
      <HomeCategory />
    </div>
  );
};
