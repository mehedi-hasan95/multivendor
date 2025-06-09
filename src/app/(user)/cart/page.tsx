import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { CartItems } from "./_components/cart-items";
import { authSession } from "@/lib/auth-session";
import { EmptyCart } from "./_components/empty-cart";
import { LoadingSkeleton } from "@/app/(home)/_components/common/loading-skeleton";

const CartPage = async () => {
  const sussion = await authSession();
  if (!sussion?.user) {
    return (
      <EmptyCart
        title="Looks like you don't login yet"
        buttonLink="/login"
        buttonText="Please Login"
      />
    );
  }
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.cart.getCart.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<LoadingSkeleton />}>
        <CartItems />
      </Suspense>
    </HydrationBoundary>
  );
};

export default CartPage;
