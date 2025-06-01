import { getQueryClient, trpc } from "@/trpc/server";
import { CartItems } from "./cart-items";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const CartPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.cart.getCart.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CartItems />
    </HydrationBoundary>
  );
};

export default CartPage;
