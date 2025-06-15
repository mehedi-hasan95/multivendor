"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatPrice } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Eye, Package } from "lucide-react";
import Image from "next/image";
import ProductTable from "../main/product-table";

// Mock data - in a real app, this would come from your API

function getStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "PROCESSING":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "SHIPPED":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case "DELIVERED":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "CANCELLED":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "REFUNDED":
      return "bg-red-100 text-red-800 border-red-500/30";
  }
}

export const OrderItems = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.cart.allOrders.queryOptions({}));
  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-muted-foreground mt-2">
            Track and manage your order history
          </p>
        </div>

        <div className="space-y-6">
          {data.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{order.id}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatPrice(
                          order.OrderItems.reduce(
                            (sum, item) => sum + item.price * item.quantity,
                            0
                          )
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order._count.OrderItems}
                        {order._count.OrderItems > 1 ? " items" : " item"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.OrderItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <Image
                          src={item.product.images[0].url || "/placeholder.svg"}
                          alt={item.product.title}
                          width={60}
                          height={60}
                          className="rounded-md border"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {item.product.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                          <p className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Shipping Info */}
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <div>
                      <p className="font-medium mb-1">Tracking Number</p>
                      <p className="text-muted-foreground font-mono">
                        {order.id}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="w-auto">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>

                  <Separator />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {data.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-4">
                When you place your first order, it will appear here.
              </p>
              <Button>Start Shopping</Button>
            </CardContent>
          </Card>
        )}
      </div>
      <div>
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-muted-foreground mt-2 pb-2">
            Track and manage your order history by table view
          </p>
        </div>
        <ProductTable showPagination={true} />
      </div>
    </div>
  );
};
