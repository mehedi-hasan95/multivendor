import { getSingelCategoyAction } from "@/action/admin";
import { CategoryForm } from "./_components/category-from";

const CategorySlag = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;
  const category = await getSingelCategoyAction(slug);
  return <CategoryForm initialData={category} />;
};

export default CategorySlag;
