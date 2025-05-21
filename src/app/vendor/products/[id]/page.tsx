import { Separator } from "@/components/ui/separator";
import { CreateProduct } from "./_components/create-product";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const ProductPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());
  return (
    <div>
      <Separator className="mb-3" />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CreateProduct />
      </HydrationBoundary>
    </div>
  );
};

export default ProductPage;
