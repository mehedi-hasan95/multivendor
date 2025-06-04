"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { cartGetCartOutput } from "@/constants/trpc.types";
import { EmptyCart } from "./empty-cart";

export const CartItems = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: cartData } = useSuspenseQuery(trpc.cart.getCart.queryOptions());

  const deleteCartItem = useMutation(
    trpc.cart.removeCart.mutationOptions({
      onMutate: async (variables) => {
        await queryClient.cancelQueries(trpc.cart.getCart.queryOptions());
        const previousCart = queryClient.getQueryData(
          trpc.cart.getCart.queryKey()
        );

        queryClient.setQueryData(
          trpc.cart.getCart.queryKey(),
          (old: cartGetCartOutput | undefined) => {
            if (!old) return old;
            return old.filter((item) => item.id !== variables.id);
          }
        );
        toast.info("Removing item from cart...");
        return { previousCart };
      },
      onError: (error) => {
        toast.error(`Failed to remove item: ${error.message}`);
      },
      onSettled: () => {
        queryClient.invalidateQueries();
      },
    })
  );

  const update = useMutation(
    trpc.cart.updateCart.mutationOptions({
      onMutate: async ({ id, quantity }) => {
        await queryClient.cancelQueries(trpc.cart.getCart.queryOptions());
        const previousCart = queryClient.getQueryData(
          trpc.cart.getCart.queryKey()
        );
        queryClient.setQueryData(
          trpc.cart.getCart.queryKey(),
          (old: cartGetCartOutput | undefined) => {
            if (!old) return old;
            return old.map((item) =>
              item.id === id ? { ...item, quantity } : item
            );
          }
        );

        return { previousCart };
      },
      onError: (error, variables, context) => {
        queryClient.setQueryData(
          trpc.cart.getCart.queryKey(),
          context?.previousCart
        );
        toast.error(`Failed to update quantity: ${error.message}`);
      },
      onSuccess: () => {
        toast.success("Quantity updated successfully");
      },
      onSettled: () => {
        queryClient.invalidateQueries(trpc.cart.getCart.queryOptions());
      },
    })
  );
  const updateQuantity = (id: string, newQuantity: number, cartId: string) => {
    if (cartData.length < 1) return;

    update.mutate({ id: cartId, quantity: newQuantity });
  };

  const removeItem = (id: string) => {
    deleteCartItem.mutate({ id });
  };

  const subtotal = cartData.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cartData.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <p className="text-muted-foreground">
          {cartData.length} {cartData.length === 1 ? "item" : "items"} in your
          cart
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartData.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="relative h-24 w-24 flex-shrink-0">
                    <Image
                      src={item.product.images[0].url}
                      alt={item.product.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {item.product.title}
                        </h3>

                        {item.product.stock === item.product.sale && (
                          <Badge variant="destructive" className="mt-1">
                            Out of Stock
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                        {item.product.basePrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(
                              item.product.basePrice * item.quantity
                            )}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity - 1,
                              item.id
                            )
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity + 1,
                              item.id
                            )
                          }
                          disabled={item.product.stock === item.product.sale}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              {shipping > 0 && (
                <p className="text-sm text-muted-foreground">
                  Free shipping on orders over $50
                </p>
              )}

              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>
              <Button variant="outline" className="w-full">
                Save for Later
              </Button>
            </CardFooter>
          </Card>

          {/* Promo Code */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Promo Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className="flex-1 px-3 py-2 border border-input rounded-md text-sm"
                />
                <Button variant="outline" size="sm">
                  Apply
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
