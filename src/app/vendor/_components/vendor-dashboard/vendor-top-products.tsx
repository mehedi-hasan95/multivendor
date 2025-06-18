"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";

export const VendorTopProduct = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.analytics.topProducts.queryOptions());
  const totalPrice = data?.reduce((sum, item) => sum + item.totalRevenue, 0);

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
        <CardDescription>Best performing products this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data?.map((product) => (
            <div key={product.productId} className="flex items-center">
              <div className="flex gap-2 items-center">
                <Image
                  src={product?.image}
                  alt={product.title}
                  height={100}
                  width={100}
                />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {product.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {product.totalQuantity} sales
                  </p>
                </div>
              </div>
              <div className="ml-auto font-medium">
                {formatPrice(product.totalRevenue)}
              </div>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between items-center font-bold">
            <p>Total</p>
            <p>{formatPrice(totalPrice || 0)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
