import { getSingelCategory } from "@/action/admin";
import { SubCategoryForm } from "../_components/sbu-category-form";
import { redirect } from "next/navigation";

const SubCategorie = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;
  const category = await getSingelCategory(slug);
  if (!category) {
    redirect("/admin");
  }
  return (
    <div>
      <SubCategoryForm catSlug={slug} />
    </div>
  );
};

export default SubCategorie;
