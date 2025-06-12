import { getQueryClient, trpc } from "@/trpc/server";
import Dashboard from "./_components/main/dashboard";
import { HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

const DashboardPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.cart.getSummary.queryOptions());
  return (
    <HydrationBoundary>
      <Suspense fallback={<p>Loading...</p>}>
        <Dashboard />
      </Suspense>
    </HydrationBoundary>
  );
};

export default DashboardPage;
