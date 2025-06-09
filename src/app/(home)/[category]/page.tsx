import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ProductFilters } from "../_components/common/product/products-filter";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import GradientText from "@/components/generated/gradient-text";
import { loadProductFilters } from "@/constants/nuqs/search-params";
import { SortFilter } from "../_components/common/product/sort-filter";
import { DEFAULT_LIMIT } from "@/constants/default";
import { ProductList } from "../_components/common/product/product-list";
import { LoadingSkeleton } from "../_components/common/loading-skeleton";

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<SearchParams>;
}
const CategoryPage = async ({ params, searchParams }: Props) => {
  const { category } = await params;
  const filters = await loadProductFilters(searchParams);
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      category,
      ...filters,
      limit: DEFAULT_LIMIT,
    })
  );
  void queryClient.prefetchQuery(trpc.tags.getMany.queryOptions());
  return (
    <div className="mx-4 lg:mx-12">
      <div className="flex justify-between items-center pb-5">
        <GradientText element="H1">On the market</GradientText>
        <SortFilter />
      </div>
      <div className="grid grid-cols-8 gap-4 col-span-full lg:col-span-4">
        <div className="col-span-full sm:col-span-2">
          <ProductFilters />
        </div>
        <div className="col-span-full sm:col-span-6">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<LoadingSkeleton key={6} />}>
              <ProductList isManual={true} />
            </Suspense>
          </HydrationBoundary>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
