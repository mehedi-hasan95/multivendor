"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { VendorOrderCard } from "./vendor-order-card";

export const VendorStatictic = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.analytics.analytics.queryOptions());

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatPrice(data?.totalRevenue || 0)}
          </div>
        </CardContent>
      </Card>

      <VendorOrderCard
        Icon={DollarSign}
        mainRevenue={data?.thisMonthRevenue[0].total || 0}
        percentage={data?.percentageChange || 0}
        title="This Month Revenue"
        isPrice={true}
      />

      <VendorOrderCard
        Icon={ShoppingCart}
        mainRevenue={data?.totalOrder._all || 0}
        percentage={data?.orderPercentageChange || 0}
        title="Total Orders"
      />
      <VendorOrderCard
        Icon={Package}
        mainRevenue={data?.totalSold._sum.quantity || 0}
        percentage={data?.soldPercentageChange || 0}
        title="Total Products Sold"
      />
    </div>
  );
};
