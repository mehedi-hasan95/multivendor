import { getQueryClient, trpc } from "@/trpc/server";
import Dashboard from "./_components/main/dashboard";
import { HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { DashboardSkeleton } from "./_components/main/dashboard-skeleton";

const DashboardPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.cart.getSummary.queryOptions());
  void queryClient.prefetchQuery(trpc.cart.latestOrder.queryOptions());
  return (
    <HydrationBoundary>
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard />
      </Suspense>
    </HydrationBoundary>
  );
};

export default DashboardPage;
