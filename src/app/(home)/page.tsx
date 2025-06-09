import { getQueryClient, trpc } from "@/trpc/server";
import { ProductList } from "./_components/common/product/product-list";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SearchParams } from "nuqs";
import { loadProductFilters } from "@/constants/nuqs/search-params";
import { DEFAULT_LIMIT } from "@/constants/default";
import { ProductFilters } from "./_components/common/product/products-filter";
import { Suspense } from "react";
import { LoadingSkeleton } from "./_components/common/loading-skeleton";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ category?: string; subCategory?: string }>;
  searchParams: Promise<SearchParams>;
}
export default async function Home({ params, searchParams }: Props) {
  const { category, subCategory } = await params;
  const filters = await loadProductFilters(searchParams);
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      category,
      subCategory,
      ...filters,
      limit: DEFAULT_LIMIT,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="grid grid-cols-8 gap-4 col-span-full lg:col-span-4 mx-4 lg:mx-12">
        <div className="col-span-full sm:col-span-2">
          <ProductFilters />
        </div>
        <Suspense
          fallback={
            <div className="col-span-full sm:col-span-6 space-x-3">
              <LoadingSkeleton items={8} />
            </div>
          }
        >
          <ProductList />
        </Suspense>
      </div>
    </HydrationBoundary>
  );
}
