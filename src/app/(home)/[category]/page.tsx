import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ProductCard } from "../_components/common/product/product-card";
import { ProductFilters } from "../_components/common/product/products-filter";
import { SearchParams } from "nuqs/server";
import { loadProductFilters } from "../_components/hooks/use-product-filter";

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<SearchParams>;
}
const CategoryPage = async ({ params, searchParams }: Props) => {
  const { category } = await params;
  const filters = await loadProductFilters(searchParams);
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({ category, ...filters })
  );
  return (
    <div className="grid grid-cols-8 gap-4 col-span-full lg:col-span-4 mx-4 lg:mx-12">
      <div className="col-span-full sm:col-span-2">
        <ProductFilters />
      </div>
      <div className="col-span-full sm:col-span-6">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ProductCard />
        </HydrationBoundary>
      </div>
    </div>
  );
};

export default CategoryPage;
