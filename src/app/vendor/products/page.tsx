import { VendorProductCreate } from "./_components/vendor-products-create";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { VendorProductCreateLink } from "./_components/vendor-product-create-link";

const VendorProductPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.products.getManyBySeller.queryOptions());
  void queryClient.prefetchQuery(trpc.user.userDetails.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <>
        <Suspense>
          <VendorProductCreateLink />
        </Suspense>
        <Suspense>
          <VendorProductCreate />
        </Suspense>
      </>
    </HydrationBoundary>
  );
};

export default VendorProductPage;
