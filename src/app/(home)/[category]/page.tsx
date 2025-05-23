import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { LoadingSkeleton } from "../_components/common/loading-skeleton";
import { ProductCard } from "../_components/common/product/product-card";

interface Props {
  params: Promise<{ category: string }>;
}
const CategoryPage = async ({ params }: Props) => {
  const { category } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({ category })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<LoadingSkeleton items={12} />}>
        <ProductCard />
      </Suspense>
    </HydrationBoundary>
  );
};

export default CategoryPage;
