"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowLeft, Truck } from "lucide-react";

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
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/common/loading-button";

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

  const [shippingMethod, setShippingMethod] = useState("standard");

  const subtotal = cartData.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingCost =
    shippingMethod === "express"
      ? 15.99
      : shippingMethod === "overnight"
      ? 29.99
      : 0;
  // const tax = subtotal * 0.08;
  // const total = subtotal + shippingCost + tax;

  const total = subtotal + shippingCost;

  const checkOut = useMutation(
    trpc.cart.purchase.mutationOptions({
      onSuccess: (data) => {
        if (data.url) {
          window.location.href = data.url;
        }
      },
      onError: () => {
        toast.error(`Checkout failed. Pleae try later`);
      },
    })
  );
  const purchase = () => {
    checkOut.mutate({
      cartItems: cartData.map((item) => ({
        id: item.id,
        productId: item.productId,
        imageUrl: item.product.images[0].url,
        price: item.product.price,
        quantity: item.quantity,
        sale: item.product.sale,
        sellerUserName: item.product.sellerUserName,
        stock: item.product.stock,
        title: item.product.title,
      })),
      shippingMethod,
    });
  };
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
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={shippingMethod}
                onValueChange={setShippingMethod}
              >
                <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label
                      htmlFor="standard"
                      className="flex items-center gap-2"
                    >
                      <Truck className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Standard Shipping</div>
                        <div className="text-sm text-muted-foreground">
                          5-7 business days
                        </div>
                      </div>
                    </Label>
                  </div>
                  <span className="font-semibold">$0.00</span>
                </div>
                <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="express" id="express" />
                    <Label
                      htmlFor="express"
                      className="flex items-center gap-2"
                    >
                      <Truck className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Express Shipping</div>
                        <div className="text-sm text-muted-foreground">
                          2-3 business days
                        </div>
                      </div>
                    </Label>
                  </div>
                  <span className="font-semibold">$15.99</span>
                </div>
                <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="overnight" id="overnight" />
                    <Label
                      htmlFor="overnight"
                      className="flex items-center gap-2"
                    >
                      <Truck className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Overnight Shipping</div>
                        <div className="text-sm text-muted-foreground">
                          Next business day
                        </div>
                      </div>
                    </Label>
                  </div>
                  <span className="font-semibold">$29.99</span>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {/* <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div> */}

              <Separator />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              {checkOut.isPending ? (
                <LoadingButton title="Processing..." />
              ) : (
                <Button className="w-full" size="lg" onClick={purchase}>
                  Proceed to Checkout
                </Button>
              )}
              <Button variant="outline" className="w-full">
                Save for Later
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};
