import { Separator } from "@/components/ui/separator";
import { CreateProduct } from "./_components/create-product";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

const ProductPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());
  void queryClient.prefetchQuery(trpc.tags.getMany.queryOptions());
  return (
    <div>
      <Separator className="mb-3" />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense>
          <CreateProduct />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
};

export default ProductPage;
