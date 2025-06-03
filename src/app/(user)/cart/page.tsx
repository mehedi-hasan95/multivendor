export const dynamic = "force-dynamic";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { CartItems } from "./cart-items";

const CartPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.cart.getCart.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading cart...</div>}>
        <CartItems />
      </Suspense>
    </HydrationBoundary>
  );
};

export default CartPage;
