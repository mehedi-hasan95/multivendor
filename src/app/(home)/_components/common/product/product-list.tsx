"use client";

import { InfinityScroll } from "@/components/common/infinity-scroll";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useProductFilters } from "../../hooks/use-product-filter";
import { useParams } from "next/navigation";
import { ProductCard } from "./product-card";
import { DEFAULT_LIMIT } from "@/constants/default";
import NoProductsFound from "@/components/common/no-products-found";

interface Props {
  isManual?: boolean;
}
export const ProductList = ({ isManual = false }: Props) => {
  const [filters] = useProductFilters();
  const params = useParams();
  const categoryParam = params.category as string | undefined;
  const sbuCategoryParam = params.subcategory as string | undefined;
  const trpc = useTRPC();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      trpc.products.getMany.infiniteQueryOptions(
        {
          limit: DEFAULT_LIMIT,
          category: categoryParam,
          subCategory: sbuCategoryParam,
          ...filters,
        },
        {
          getNextPageParam: (lastPage) => {
            return lastPage.products.length > 0
              ? lastPage.nextCursor
              : undefined;
          },
        }
      )
    );
  return (
    <div className="col-span-full sm:col-span-6">
      {data.pages.flatMap(
        (page) => page.products.length < 1 && <NoProductsFound />
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {data.pages
          .flatMap((page) => page.products)
          .map((product) => (
            <ProductCard
              key={product.id}
              categoryId={product.categoryId}
              price={product.price}
              productId={product.id}
              productImage={product.images[0].url}
              sellerName={product.seller.name}
              serlerUserName={product.seller.username}
              subCategoryId={product.subCategoryId}
              title={product.title}
              sellerImage={product.seller.image || undefined}
            />
          ))}
      </div>
      <InfinityScroll
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isManual={isManual}
      />
    </div>
  );
};
