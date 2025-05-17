import { Categories, SubCategories } from "@/generated/prisma";
import Link from "next/link";

interface Props {
  category: Categories & { SubCategories: SubCategories[] };
  isOpen: boolean;
  position: { top: number; left: number };
}
export const SubCategoryMenu = ({ isOpen, position, category }: Props) => {
  if (!isOpen || !category.SubCategories || !category.SubCategories.length) {
    return null;
  }
  return (
    <div
      className="fixed z-100"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <div className="h-3 w-60" />
      <div
        className="w-60 rounded-md overflow-hidden border shadow-[4px_4px_0px_0px_rgba(167,110,246,0.8)]"
        style={{
          backgroundColor: category.color || "#020101",
        }}
      >
        <div>
          {category.SubCategories.map((item) => (
            <Link
              href={item.slug}
              key={item.id}
              className="w-full text-left p-4 hover:bg-[#a76ef6]/50 flex justify-between items-center underline font-medium"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
