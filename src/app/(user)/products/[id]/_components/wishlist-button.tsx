"use client";

import { Button } from "@/components/ui/button";
import { getWishlistOutput, productGetOne } from "@/constants/trpc.types";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { toast } from "sonner";

interface Props {
  data: productGetOne;
  visibleCartText?: boolean;
  className?: string;
}
export const WishListButton = ({
  data,
  className,
  visibleCartText = true,
}: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

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
            queryClient.setQueryData(trpc.wishlist.getWishlist.queryKey(), [
              ...previousWishlist,
              { product: data, id: input.id },
            ] as getWishlistOutput);
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

  const handleAddToWishlist = () => {
    addToWishlist.mutate({ id: data?.id as string });
  };
  return (
    <Button
      variant="outline"
      className={cn("flex-1 h-12", className)}
      onClick={handleAddToWishlist}
    >
      {isInWishlist ? (
        <Heart className="h-4 w-4 text-red-500 fill-red-500" />
      ) : (
        <Heart className="h-4 w-4" />
      )}
      {visibleCartText && "Save"}
    </Button>
  );
};
