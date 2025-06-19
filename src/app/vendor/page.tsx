import { getQueryClient, trpc } from "@/trpc/server";
import { VendorOrderGraph } from "./_components/vendor-dashboard/vendor-order-graph";
import { VendorStatictic } from "./_components/vendor-dashboard/vendor-statistic";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { VendorTopProduct } from "./_components/vendor-dashboard/vendor-top-products";

const AdminPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.vendor.monthlyAnalytics.queryOptions());
  void queryClient.prefetchQuery(trpc.vendor.topProducts.queryOptions());
  return (
    <div className="space-y-6">
      <VendorStatictic />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Suspense fallback={<p>Loading...</p>}>
            <VendorOrderGraph />
          </Suspense>
          <Suspense fallback={<p>Loading...</p>}>
            <VendorTopProduct />
          </Suspense>
        </div>
      </HydrationBoundary>
    </div>
  );
};

export default AdminPage;
