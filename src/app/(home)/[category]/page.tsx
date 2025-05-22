import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { LoadingSkeleton } from "../_components/common/loading-skeleton";
import { CategoryData } from "./_components/category-data";

const CategoryPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<LoadingSkeleton items={12} />}>
        <CategoryData />
      </Suspense>
    </HydrationBoundary>
  );
};

export default CategoryPage;
