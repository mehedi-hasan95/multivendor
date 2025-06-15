"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { RatingsForm } from "./rating-form";

export const ProductRatings = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.cart.allOrders.queryOptions({ shipping: "DELIVERED" })
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-muted-foreground mt-2">
          Track and manage your order history
        </p>
      </div>

      <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {data.map((items) =>
          items.OrderItems.map((order) => (
            <Card key={order.id} className="p-0 pb-4">
              <CardHeader className="p-0">
                <Image
                  src={order.product.images[0].url}
                  alt={order.product.title}
                  height={500}
                  width={500}
                  className="h-full w-full aspect-video object-cover"
                />
                <h2 className="text-xl md:text-2xl lg:text-3xl px-6">
                  {order.product.title}
                </h2>
              </CardHeader>
              <CardContent>
                <RatingsForm orderId={items.id} productId={order.product.id} />
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {data.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-4">
              When you place your first order, it will appear here.
            </p>
            <Link href={"/"}>
              <Button>Start Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
