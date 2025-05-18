"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CategoriesType } from "@/constants/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: CategoriesType[];
}
export const CategoriesSidebar = ({
  onOpenChange,
  open,
  categories,
}: Props) => {
  const router = useRouter();

  const [parentCategories, setParentCategories] = useState<
    CategoriesType[] | null
  >(null);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoriesType | null>(null);
  const currentCategories = parentCategories ?? categories ?? [];
  const handleOpenChange = (open: boolean) => {
    setSelectedCategory(null);
    setParentCategories(null);
    onOpenChange(open);
  };
  const handleBackClick = () => {
    if (parentCategories) {
      setSelectedCategory(null);
      setParentCategories(null);
    }
  };
  const handleCategoryClick = (category: CategoriesType) => {
    if (category.SubCategories && category.SubCategories.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setParentCategories(category.SubCategories as any);
      setSelectedCategory(category);
    } else {
      if (parentCategories && selectedCategory) {
        router.push(`/${selectedCategory.slug}/${category.slug}`);
      } else {
        if (category.slug === "all") {
          router.push("/");
        } else {
          router.push(`/${category.slug}`);
        }
      }
      handleOpenChange(false);
    }
  };
  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="left"
        style={{
          backgroundColor: selectedCategory?.color || "#0f0f0f",
        }}
      >
        <SheetHeader>
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {parentCategories && (
            <button
              onClick={handleBackClick}
              className="w-full text-left p-4 flex cursor-pointer items-center text-base font-medium hover:bg-themePurple/70"
            >
              <ChevronLeft className="size-4 mr-2" />
              Back
            </button>
          )}
          {currentCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="w-full text-left p-4 flex cursor-pointer justify-between items-center text-base font-medium hover:bg-themePurple/70 capitalize"
            >
              <Link href={category.slug}>{category.name}</Link>
              {category.SubCategories && category.SubCategories.length > 0 && (
                <ChevronRight className="size-4" />
              )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
