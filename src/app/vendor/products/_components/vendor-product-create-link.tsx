"use client";

import { HeaderTitle } from "@/components/common/header-title";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const VendorProductCreateLink = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.user.userDetails.queryOptions());
  return (
    <HeaderTitle
      title="Your Products"
      description="All of your product will shown here"
      linkText={
        data?.stripeConnectLink === true ? "Create Product" : "Add Stripe"
      }
      linkHref={
        data?.stripeConnectLink === true
          ? "/vendor/products/new"
          : "/vendor/billing"
      }
    />
  );
};
