import { TagForm } from "../_components/tag-form";

const CategorySlag = async ({ params }: { params: { slug: string } }) => {
  return (
    <div>
      <TagForm />
    </div>
  );
};

export default CategorySlag;
