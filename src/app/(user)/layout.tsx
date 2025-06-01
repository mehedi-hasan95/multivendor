import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface UserLayoutProps {
  children: React.ReactNode;
}
const UserLayout = async ({ children }: UserLayoutProps) => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.cart.getCart.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </HydrationBoundary>
  );
};

export default UserLayout;
