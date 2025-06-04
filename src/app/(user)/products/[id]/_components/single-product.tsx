"use client";

import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2 } from "lucide-react";
import { formatPrice, generateTenentUrl } from "@/lib/utils";
import { redirect, usePathname } from "next/navigation";
import Link from "next/link";
import { AuthorImg } from "@/components/common/author-img";
import { StarRating } from "./star-rating";
import {
  Carousel,
  CarouselMainContainer,
  CarouselNext,
  CarouselPrevious,
  SliderMainItem,
  CarouselThumbsContainer,
  SliderThumbItem,
} from "@/components/generated/carousel-modify";
import { Fragment, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface ProductDetailsProps {
  id: string;
}
export const SingleProduct = ({ id }: ProductDetailsProps) => {
  const pathName = usePathname();
  const shareLink = () => {
    const url = `${process.env.NEXT_PUBLIC_URL}${pathName}`;
    navigator.clipboard.writeText(url);
    toast.success(url);
  };
  const [quentity, setQuantity] = useState<number>(1);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data } = useSuspenseQuery(trpc.products.getOne.queryOptions({ id }));
  const { data: cartData } = useSuspenseQuery(trpc.cart.getCart.queryOptions());
  const inCart = cartData?.some((item) => item.product.id === data?.id);
  const create = useMutation(
    trpc.cart.create.mutationOptions({
      onMutate: async (input) => {
        await queryClient.cancelQueries(trpc.cart.getCart.queryOptions());
        const previousCart = queryClient.getQueryData(
          trpc.cart.getCart.queryKey()
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        queryClient.setQueryData(trpc.cart.getCart.queryKey(), (old: any) =>
          old
            ? [...old, { ...input, product: data }]
            : [{ ...input, product: data }]
        );
        return { previousCart };
      },

      onError: (err, input, context) => {
        queryClient.setQueryData(
          trpc.cart.getCart.queryKey(),
          context?.previousCart
        );
        toast.error(err.message);
      },
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.cart.getCart.queryOptions());
      },
      onSettled: () => {
        queryClient.invalidateQueries(trpc.cart.getCart.queryOptions());
        queryClient.invalidateQueries(
          trpc.products.getOne.queryOptions({ id })
        );
      },
    })
  );

  // Wishlist action
  const { data: wishlistData } = useSuspenseQuery(
    trpc.wishlist.getWishlist.queryOptions()
  );
  const isInWishlist = wishlistData?.some(
    (item) => item.product.id === data?.id
  );
  const addToWishlist = useMutation(
    trpc.wishlist.addWishlist.mutationOptions({
      onMutate: async (input) => {
        await queryClient.cancelQueries(
          trpc.wishlist.getWishlist.queryOptions()
        );
        const previousWishlist = queryClient.getQueryData(
          trpc.wishlist.getWishlist.queryKey()
        );
        if (previousWishlist) {
          const existingItem = previousWishlist.find(
            (item) => item.product.id === input.id
          );
          if (existingItem) {
            queryClient.setQueryData(
              trpc.wishlist.getWishlist.queryKey(),
              previousWishlist.filter((item) => item.product.id !== input.id)
            );
          } else {
            queryClient.setQueryData(
              trpc.wishlist.getWishlist.queryKey(),
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              [...(previousWishlist as any), { product: data, id: input.id }]
            );
          }
        }

        return { previousWishlist };
      },
      onError: (err, input, context) => {
        queryClient.setQueryData(
          trpc.wishlist.getWishlist.queryKey(),
          context?.previousWishlist
        );
        toast("Please login to add items to the wishlist");
      },
      onSettled: () => {
        queryClient.invalidateQueries(trpc.wishlist.getWishlist.queryOptions());
      },
    })
  );

  if (!data) {
    return redirect("/");
  }
  const discount = data?.basePrice
    ? Math.round(((data.basePrice - data.price) / data.basePrice) * 100)
    : 0;

  const handleAddToCart = () => {
    create.mutate({
      productId: data.id,
      quantity: quentity,
    });
  };
  const handleAddToWishlist = () => {
    addToWishlist.mutate({ id: data.id });
  };
  return (
    <div>
      <div className="">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <Carousel>
                <CarouselNext className="top-1/3 -translate-y-1/3" />
                <CarouselPrevious className="top-1/3 -translate-y-1/3" />
                <CarouselMainContainer className="h-full w-full relative aspect-video">
                  {data.images.map((item) => (
                    <SliderMainItem key={item.id} className="bg-transparent">
                      <Image
                        src={item.url}
                        alt=""
                        fill
                        className="h-full object-cover"
                      />
                    </SliderMainItem>
                  ))}
                </CarouselMainContainer>
                <CarouselThumbsContainer>
                  {data.images.map((item, index) => (
                    <SliderThumbItem
                      key={index}
                      index={index}
                      className="bg-transparent"
                    >
                      <div className="outline outline-border size-full flex flex-wrap items-center justify-center rounded-xl bg-background">
                        <Image src={item.url} alt="" fill />
                      </div>{" "}
                    </SliderThumbItem>
                  ))}
                </CarouselThumbsContainer>
              </Carousel>
              <div className="space-y-4">
                <p className="text-gray-200 leading-relaxed">
                  {data.description}
                </p>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-light tracking-tight">
                  Minimalist Ceramic Vase
                </h1>
                <div className="flex items-center space-x-2">
                  <StarRating rating={4} text="(128 reviews)" />
                </div>
              </div>
              <Link
                href={generateTenentUrl(data.seller.username)}
                className="flex gap-2 items-center"
              >
                <AuthorImg img={data.seller.image} />
                <p className="font-medium">{data.seller.name}</p>
              </Link>
              <div className="space-y-2">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-light">
                    {formatPrice(data?.price * quentity)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(data?.basePrice * quentity)}
                  </span>
                  <Badge variant="destructive" className="text-xs">
                    {discount}% OFF
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() =>
                        setQuantity((prev) => Math.max(prev - 1, 1))
                      }
                    >
                      <span className="sr-only">Decrease quantity</span>-
                    </Button>
                    <span className="text-sm font-medium w-8 text-center">
                      {quentity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setQuantity((prev) => prev + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {inCart ? (
                  <Button className="w-full h-12 text-base">In Cart</Button>
                ) : (
                  <Button
                    className="w-full h-12 text-base"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                )}
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="flex-1 h-12"
                    onClick={handleAddToWishlist}
                  >
                    {isInWishlist ? (
                      <Heart className="h-4 w-4 mr-2 text-red-500 fill-red-500" />
                    ) : (
                      <Heart className="h-4 w-4 mr-2" />
                    )}
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-12"
                    onClick={shareLink}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="space-y-2 text-sm text-gray-600">
                  <p>✓ 30-day return policy</p>
                  <p>✓ 2-year warranty included</p>
                  <p>✓ Secure payment processing</p>
                </div>
                <div className="pt-4">
                  <p className="text-lg font-medium">Ratings</p>
                  <div className="grid grid-cols-[auto_1fr_auto] gap-3 mt-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Fragment key={star}>
                        <div className="font-medium">
                          {star}
                          {star === 1 ? " star" : " stars"}
                        </div>
                        <Progress
                          value={20}
                          className="h-[1lh] bg-gray-800 [&>div]:bg-amber-200"
                        />
                        <div className="font-medium">0%</div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
