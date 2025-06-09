"use client";

import { Button } from "@/components/ui/button";
import { cartGetCartOutput, productGetOne } from "@/constants/trpc.types";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface Props {
  data: productGetOne;
  quentity: number;
}
export const CartButton = ({ data, quentity }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: cartData } = useSuspenseQuery(trpc.cart.getCart.queryOptions());
  const inCart = cartData?.some((item) => item.product.id === data?.id);
  const create = useMutation(
    trpc.cart.create.mutationOptions({
      onMutate: async (input) => {
        await queryClient.cancelQueries(trpc.cart.getCart.queryOptions());
        const previousCart = queryClient.getQueryData(
          trpc.cart.getCart.queryKey()
        );
        if (previousCart) {
          const existingItem = previousCart.find(
            (item) => item.product.id === input.productId
          );
          if (existingItem) {
            queryClient.setQueryData(
              trpc.cart.getCart.queryKey(),
              previousCart.filter((item) => item.product.id !== input.productId)
            );
          } else {
            queryClient.setQueryData(trpc.cart.getCart.queryKey(), [
              ...previousCart,
              { product: data, id: input.productId },
            ] as cartGetCartOutput);
          }
        }
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
      },
    })
  );
  const handleAddToCart = () => {
    create.mutate({
      productId: data?.id as string,
      quantity: quentity,
    });
  };
  return (
    <div className="flex-1">
      {inCart ? (
        <Button className="w-full h-12 text-base" variant={"outline"}>
          <ShoppingCart className="h-4 w-4 mr-2" /> In Cart
        </Button>
      ) : (
        <Button
          className="w-full h-12 text-base flex-1"
          onClick={handleAddToCart}
          variant={"outline"}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      )}
    </div>
  );
};
