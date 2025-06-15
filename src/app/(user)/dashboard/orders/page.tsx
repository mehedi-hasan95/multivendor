import { getQueryClient, trpc } from "@/trpc/server";
import { OrderItems } from "../_components/orders/order-items";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { DashboardSkeleton } from "../_components/main/dashboard-skeleton";

const OrdersPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.cart.allOrders.queryOptions({}));
  void queryClient.prefetchQuery(trpc.cart.latestOrder.queryOptions({}));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<DashboardSkeleton />}>
        <OrderItems />
      </Suspense>
    </HydrationBoundary>
  );
};

export default OrdersPage;
