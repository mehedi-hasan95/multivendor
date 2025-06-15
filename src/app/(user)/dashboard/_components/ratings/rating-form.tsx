"use client";

import { ratingsSchame } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "./star-rating";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoadingButton } from "@/components/common/loading-button";
import { useState } from "react";

interface Props {
  orderId: string;
  productId: string;
}
export const RatingsForm = ({ orderId, productId }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(
    trpc.reviews.getOneReviews.queryOptions({ id: productId, order: orderId })
  );
  const [isPreview, setIsPreview] = useState(!!data);
  const router = useRouter();
  // 1. Define your form.

  const form = useForm<z.infer<typeof ratingsSchame>>({
    resolver: zodResolver(ratingsSchame),
    defaultValues: {
      rating: data?.ratings || undefined,
      review: data?.reviews || undefined,
    },
  });

  form.watch();

  function isFormEmpty() {
    const values = form.getValues();
    return (!values.rating || values.rating === 0) && !values.review;
  }
  // 2. Define a submit handler.

  const create = useMutation(
    trpc.reviews.createRating.mutationOptions({
      onSuccess: () => {
        toast("Review created");
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.message);
      },
      onSettled: () => {
        queryClient.invalidateQueries(
          trpc.reviews.getOneReviews.queryOptions({
            id: productId,
            order: orderId,
          })
        );
      },
    })
  );
  const update = useMutation(
    trpc.reviews.updateRegiew.mutationOptions({
      onMutate: async (updateReview) => {
        await queryClient.cancelQueries(
          trpc.reviews.getOneReviews.queryOptions({
            id: productId,
            order: orderId,
          })
        );

        // Snapshot the previous value
        const previousData = queryClient.getQueryData(
          trpc.reviews.getOneReviews.queryKey({
            id: productId,
            order: orderId,
          })
        );

        // Optimistically update to the new value
        queryClient.setQueryData(
          trpc.reviews.getOneReviews.queryKey({
            id: productId,
            order: orderId,
          }),
          // (old) => {
          //   if (!old) return old;
          //   return {
          //     ...old,
          //     ratings: updateReview.ratings ?? old.ratings,
          //     reviews: updateReview.reviews ?? old.reviews,
          //   };
          // }
          (old) => old && { ...old, ...updateReview }
        );

        toast("Review updated");
        return { previousData };
      },
      onError: (error) => {
        toast.error(error.message);
      },
      onSettled: () => {
        queryClient.invalidateQueries(
          trpc.reviews.getOneReviews.queryOptions({
            id: productId,
            order: orderId,
          })
        );
      },
    })
  );
  function onSubmit(values: z.infer<typeof ratingsSchame>) {
    const updateData = {
      orderId,
      productId,
      ratingsSchame: {
        rating: values.rating,
        review: values.review,
      },
    };
    if (data?.id) {
      update.mutate({
        id: data.id,
        productId: productId,
        ratings: values.rating,
        reviews: values.review,
      });
    } else {
      create.mutate(updateData);
    }
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {isPreview ? "Your rating" : "Give your rating"}
                </FormLabel>
                <FormControl>
                  <StarRating
                    rating={field.value as number}
                    onRatingChange={field.onChange}
                    disabled={isPreview}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="review"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {isPreview ? "Your review" : "Write review"}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us what you liked or disliked about this product..."
                    {...field}
                    disabled={isPreview}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!isPreview &&
            (create.isPending ? (
              <LoadingButton />
            ) : (
              <Button type="submit" disabled={isFormEmpty()}>
                {data ? "Update rating" : "Post rating"}
              </Button>
            ))}
        </form>
        {isPreview && (
          <Button onClick={() => setIsPreview(false)} className="mt-8 mb-4">
            Edit for rating
          </Button>
        )}
      </Form>
    </div>
  );
};
