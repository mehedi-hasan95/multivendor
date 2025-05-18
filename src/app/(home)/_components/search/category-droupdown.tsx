"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { useDropdownPosition } from "./use-dropdown-position";
import { SubCategoryMenu } from "./sub-category-menu";
import { CategoriesType } from "@/constants/types";
import Link from "next/link";

interface Props {
  category: CategoriesType;
  isActive?: boolean;
  isNavigationHovered?: boolean;
}
export const CategoryDorupdown = ({
  category,
  isActive,
  isNavigationHovered,
}: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const droupdownRef = useRef<HTMLDivElement>(null);
  const { getDropdownPostion } = useDropdownPosition(droupdownRef);
  const droupdownPosition = getDropdownPostion();
  const toggleDropdown = () => {
    if (category.SubCategories.length) {
      setIsOpen(!isOpen);
    }
  };
  const onMouseEnter = () => {
    if (category.SubCategories) {
      setIsOpen(true);
    }
  };
  const onMouseLeave = () => setIsOpen(false);

  return (
    <div
      className="relative"
      ref={droupdownRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={toggleDropdown}
    >
      <div className="relative">
        <Button
          variant={"elevated"}
          className={cn(
            "h-11 capitalize bg-transparent",
            isActive && !isNavigationHovered && "border-themePurple",
            isOpen &&
              "shadow-[4px_4px_0px_0px_rgba(167,110,246,0.8)] -translate-x-1 -translate-y-1"
          )}
        >
          <Link href={`/${category.slug === "all" ? "" : category.slug}`}>
            {category.name}
          </Link>
        </Button>
        {category.SubCategories && category.SubCategories.length > 0 && (
          <div
            className={cn(
              "opacity-0 absolute -bottom-3 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-slate-400 left-1/2 -translate-x-1/2",
              isOpen && "opacity-100"
            )}
          />
        )}
      </div>
      <SubCategoryMenu
        isOpen={isOpen}
        position={droupdownPosition}
        category={category}
      />
    </div>
  );
};
