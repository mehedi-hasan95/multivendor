"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { StarRating } from "../products/[id]/_components/star-rating";
import { WishListButton } from "../products/[id]/_components/wishlist-button";
import { productGetOne } from "@/constants/trpc.types";
import { CartButton } from "../products/[id]/_components/cart-button";

export const WishlistItems = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.wishlist.getWishlist.queryOptions());

  if (data.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-muted-foreground mb-6">
            Save items you love to your wishlist and never lose track of them.
          </p>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <p className="text-muted-foreground mt-1">
            {data.length} {data.length === 1 ? "item" : "items"} saved
          </p>
        </div>
        <Button variant="outline" className="hidden sm:flex">
          Share Wishlist
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((item) => (
          <Card key={item.id} className="group overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                <Image
                  src={item.product.images[0].url || "/placeholder.svg"}
                  alt={item.product.title}
                  height={500}
                  width={500}
                  className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                />
                {item.product.price && (
                  <Badge
                    className="absolute top-2 left-2"
                    variant="destructive"
                  >
                    Sale
                  </Badge>
                )}
                {item.product.sale === item.product.stock && (
                  <Badge
                    className="absolute bottom-2 left-2"
                    variant="secondary"
                  >
                    Out of Stock
                  </Badge>
                )}
              </div>

              <div className="p-4">
                <div className="mb-2">
                  <h3 className="font-semibold line-clamp-2 mb-2">
                    {item.product.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1 mb-2">
                  {/* <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium ml-1">
                      {item.rating}
                    </span>
                  </div> */}
                  <StarRating rating={5} />
                  {/* <span className="text-sm text-muted-foreground">
                    ({item.reviews} reviews)
                  </span> */}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg font-bold">
                    ${item.product.price}
                  </span>
                  {item.product.basePrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${item.product.basePrice}
                    </span>
                  )}
                </div>

                <Separator className="mb-4" />

                <div className="flex gap-2">
                  <CartButton
                    data={item.product as productGetOne}
                    quentity={1}
                  />
                  {/* to do out of stock  */}
                  <WishListButton
                    data={item.product as productGetOne}
                    visibleCartText={false}
                    className="flex-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href={"/"} prefetch>
          <Button variant="outline" size="lg">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};
