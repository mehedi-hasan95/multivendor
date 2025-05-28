import { DEFAULT_LIMIT } from "@/constants/default";
import { loadProductFilters } from "@/constants/nuqs/search-params";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SearchParams } from "nuqs";
import { Suspense } from "react";
import GradientText from "@/components/generated/gradient-text";
import { SortFilter } from "@/app/(home)/_components/common/product/sort-filter";
import { ProductFilters } from "@/app/(home)/_components/common/product/products-filter";
import { ProductList } from "@/app/(home)/_components/common/product/product-list";

interface Props {
  searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>;
}
const TenantSlug = async ({ params, searchParams }: Props) => {
  const { slug } = await params;
  const filters = await loadProductFilters(searchParams);
  const queryClient = getQueryClient();
  void queryClient.invalidateQueries(
    trpc.products.getMany.infiniteQueryOptions({
      sellerUserName: slug,
      ...filters,
      limit: DEFAULT_LIMIT,
    })
  );
  return (
    <>
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
            <Suspense>
              <ProductList seller={slug} />
            </Suspense>
          </HydrationBoundary>
        </div>
      </div>
    </>
  );
};

export default TenantSlug;
