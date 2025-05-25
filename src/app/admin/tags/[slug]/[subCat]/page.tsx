import { getSingelCategory, getSingelSubCategory } from "@/action/admin";
import { SubCategoryForm } from "../_components/sbu-category-form";
import { redirect } from "next/navigation";

const SubCategorie = async ({
  params,
}: {
  params: { slug: string; subCat: string };
}) => {
  const { slug, subCat } = await params;
  const category = await getSingelCategory(slug);
  const subCategory = await getSingelSubCategory(subCat);
  if (!category) {
    redirect("/admin");
  }
  return (
    <div>
      <SubCategoryForm catSlug={slug} initialData={subCategory} />
    </div>
  );
};

export default SubCategorie;
