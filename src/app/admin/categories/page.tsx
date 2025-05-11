import { getCategoriesAction } from "@/action/admin";
import { HeaderTitle } from "@/components/common/header-title";
import { CategoryItems } from "./[slug]/_components/categories-items";

const CategoriesPage = async () => {
  const categories = await getCategoriesAction();
  return (
    <div>
      <HeaderTitle
        linkHref={"/admin/categories/new"}
        linkText="Create Category"
        title="Categories"
        description="Create and manage categories."
      />
      <CategoryItems categories={categories} />
    </div>
  );
};

export default CategoriesPage;
