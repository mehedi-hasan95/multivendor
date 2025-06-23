import { getQueryClient, trpc } from "@/trpc/server";
import { StripeConnectForm } from "../_components/billing/stripe-connect-form";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

const BillingPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.stripe.getStripeConnectId.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Loading...</p>}>
        <StripeConnectForm />
      </Suspense>
    </HydrationBoundary>
  );
};

export default BillingPage;
