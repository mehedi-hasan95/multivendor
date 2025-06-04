"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Heart, Search, ShoppingCart, User } from "lucide-react";
import { Logo } from "@/components/common/logo";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const SingleNav = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.cart.getCart.queryOptions());
  const cartLength = data ? data.length : 0;
  const { data: wishlistData } = useSuspenseQuery(
    trpc.wishlist.getWishlist.queryOptions()
  );

  const wishlistLength = wishlistData ? wishlistData.length : 0;
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-between items-center px-4 lg:px-12 pt-4">
      {/* Logo */}
      <Logo />

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="hidden sm:flex">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => router.push("/wishlist")}
        >
          {wishlistLength ? (
            <Heart className="h-5 w-5 fill-red-500 text-red-500" />
          ) : (
            <Heart className="h-5 w-5" />
          )}

          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {wishlistLength}
          </Badge>
          <span className="sr-only">Shopping cart</span>
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
          <span className="sr-only">Account</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => router.push("/cart")}
        >
          <ShoppingCart className="h-5 w-5" />
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {cartLength}
          </Badge>
          <span className="sr-only">Shopping cart</span>
        </Button>
      </div>
    </header>
  );
};
