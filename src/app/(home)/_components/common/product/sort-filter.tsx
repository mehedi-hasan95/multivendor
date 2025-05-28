"use client";

import { Button } from "@/components/ui/button";
import { useProductFilters } from "../../hooks/use-product-filter";
import { cn } from "@/lib/utils";

export const SortFilter = () => {
  const [filter, setFilter] = useProductFilters();
  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="secondary"
        className={cn(
          "rounded-full border border-themePurple",
          filter.sort !== "trending" && "border-transparent"
        )}
        onClick={() => setFilter({ sort: "trending" })}
      >
        Trending
      </Button>
      <Button
        size="sm"
        variant="secondary"
        className={cn(
          "rounded-full border border-themePurple",
          filter.sort !== "best_seller" && "border-transparent"
        )}
        onClick={() => setFilter({ sort: "best_seller" })}
      >
        Best Sellers
      </Button>
      <Button
        size="sm"
        variant="secondary"
        className={cn(
          "rounded-full border border-themePurple",
          filter.sort !== "hot_and_new" && "border-transparent"
        )}
        onClick={() => setFilter({ sort: "hot_and_new" })}
      >
        Hot & New
      </Button>
    </div>
  );
};
