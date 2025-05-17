import { getCategoriesAction } from "@/action/admin";
import { CategoryDorupdown } from "./category-droupdown";

export const HomeCategory = async () => {
  const categories = await getCategoriesAction();
  return (
    <div className="flex gap-2 flex-nowrap items-center">
      {categories.map((category) => (
        <CategoryDorupdown
          category={category}
          isActive={false}
          isNavigationHovered={false}
          key={category.id}
        />
      ))}
    </div>
  );
};
