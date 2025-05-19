"use client";
import { CategoryDorupdown } from "./category-droupdown";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ListFilterIcon } from "lucide-react";
import { CategoriesSidebar } from "./categories-sidebar";
import { categoriesGetManyOutput } from "@/constants/trpc.types";
import { useParams } from "next/navigation";

interface Props {
  categories: categoriesGetManyOutput;
}
export const HomeCategory = ({ categories }: Props) => {
  const params = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const viewAllRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(categories.length);
  const [isAnyHovered, setIsAnyHovered] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const categoryParam = params.category as string | undefined;

  const activeCategory = categoryParam || "all";
  const activeCategoryIndex = categories.findIndex(
    (cat) => cat.slug === activeCategory
  );
  const isActiveCategoryHidden =
    activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;

  useEffect(() => {
    const calculateVisible = () => {
      if (!containerRef.current || !measureRef.current || !viewAllRef.current)
        return;
      const containerWidth = containerRef.current.offsetWidth;
      const viewAllWidth = viewAllRef.current.offsetWidth;
      const availableWidth = containerWidth - viewAllWidth;

      const items = Array.from(measureRef.current.children);
      let totalWidth = 0;
      let visible = 0;

      for (const item of items) {
        const width = item.getBoundingClientRect().width;
        if (totalWidth + width > availableWidth) break;
        totalWidth += width;
        visible++;
      }
      setVisibleCount(visible);
    };
    const resizeObserver = new ResizeObserver(calculateVisible);
    resizeObserver.observe(containerRef.current!);
    return () => resizeObserver.disconnect();
  }, [categories.length]);
  return (
    <div className="relative w-full">
      {/* Category sidebar open while click on the view all button  */}
      <CategoriesSidebar onOpenChange={setIsSidebarOpen} open={isSidebarOpen} />
      {/* Meserment the length  */}
      <div
        ref={measureRef}
        className="absolute opacity-0 pointer-events-none flex"
        style={{ position: "fixed", top: -9999, left: -9999 }}
      >
        {categories.map((category) => (
          <CategoryDorupdown
            category={category}
            isActive={activeCategory === category.slug}
            isNavigationHovered={false}
            key={category.id}
          />
        ))}
      </div>
      <div
        className="flex gap-2 justify-between items-center"
        ref={containerRef}
        onMouseEnter={() => setIsAnyHovered(true)}
        onMouseLeave={() => setIsAnyHovered(false)}
      >
        {categories.slice(0, visibleCount).map((category) => (
          <CategoryDorupdown
            category={category}
            isActive={activeCategory === category.slug}
            isNavigationHovered={isAnyHovered}
            key={category.id}
          />
        ))}
        <div ref={viewAllRef} className="shrink-0">
          <Button
            variant={"outline"}
            className={cn(
              "h-11 capitalize bg-transparent",
              isActiveCategoryHidden &&
                !isAnyHovered &&
                "border !border-themePurple"
            )}
            onClick={() => setIsSidebarOpen(true)}
          >
            <ListFilterIcon />
            View All
          </Button>
        </div>
      </div>
    </div>
  );
};
