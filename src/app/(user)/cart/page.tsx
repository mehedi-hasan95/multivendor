import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

const CartPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.cart.getCart.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>Mehedi</Suspense>
    </HydrationBoundary>
  );
};

export default CartPage;
