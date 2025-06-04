import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { WishlistItems } from "./wishlist-item";
import { authSession } from "@/lib/auth-session";
import { EmptyCart } from "../cart/_components/empty-cart";

const WishListPage = async () => {
  const session = await authSession();
  if (!session?.session.token) {
    return (
      <EmptyCart
        buttonLink="/"
        buttonText="Add Products"
        title="Please login to add in wishlist"
        description="wishlist"
      />
    );
  }
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.wishlist.getWishlist.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <WishlistItems />
      </Suspense>
    </HydrationBoundary>
  );
};

export default WishListPage;
