"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { ProductCard } from "../../_components/common/product-card";

const SubCategoryPage = () => {
  const params = useParams();
  const categoryParam = params.category as string | undefined;
  const sbuCategoryParam = params.subcategory as string | undefined;

  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({
      category: categoryParam,
      subCategory: sbuCategoryParam,
    })
  );
  return (
    <div>
      <ProductCard data={data} />
    </div>
  );
};

export default SubCategoryPage;
