import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { OrderTable } from "../_components/orders/order-table";

const VendorOrders = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.vendor.orders.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Loading</p>}>
        <OrderTable />
      </Suspense>
    </HydrationBoundary>
  );
};

export default VendorOrders;
