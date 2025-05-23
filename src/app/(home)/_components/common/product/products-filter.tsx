"use client";

import BackdropGradient from "@/components/generated/backdrop-gradient";
import GlassCard from "@/components/generated/glass-card";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { PriceFilter } from "./price-filter";
import { useProductFilters } from "../../hooks/use-product-filter";

interface Props {
  title: string;
  className?: string;
  children: React.ReactNode;
}
const ProductFilter = ({ children, title, className }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const Icon = isOpen ? ChevronDown : ChevronRight;
  return (
    <div className={cn("border-b py-2 flex flex-col gap-2", className)}>
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen((current) => !current)}
      >
        <p className="font-medium">{title}</p>
        <Icon className="size-5" />
      </div>
      {isOpen && children}
    </div>
  );
};
export const ProductFilters = () => {
  const [filters, setFilters] = useProductFilters();
  const hasAnyFilters = Object.entries(filters).some(([value]) => {
    if (typeof value === "string") {
      return value !== "";
    }
    return value !== null;
  });
  const clearFilter = () => {
    setFilters({
      maxPrice: "",
      minPrice: "",
    });
  };
  const onChange = (key: keyof typeof filters, value: unknown) => {
    setFilters({ ...filters, [key]: value });
  };
  return (
    <BackdropGradient
      className="w-4/12 h-3/6 opacity-50"
      container="flex flex-col items-center"
    >
      <GlassCard className="border rounded-md p-5 gap-0 z-50 w-full">
        <div className="flex justify-between items-center border-b pb-4">
          <p className="font-medium">Filter</p>
          {hasAnyFilters && (
            <button
              className="underline cursor-pointer font-medium"
              onClick={() => clearFilter()}
              type="button"
            >
              Clear
            </button>
          )}
        </div>
        <ProductFilter title="Price" className="border-b-0">
          <PriceFilter
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            onMinPriceChange={(value) => onChange("minPrice", value)}
            onMaxPriceChange={(value) => onChange("maxPrice", value)}
          />
        </ProductFilter>
      </GlassCard>
    </BackdropGradient>
  );
};
