import { db } from "@/lib/db";
import { ratingsSchame } from "@/schemas/schemas";
import { baseProcedure, createTRPCRouter, privateProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const reviewsRouter = createTRPCRouter({
  createRating: privateProcedure
    .input(
      z.object({
        orderId: z.string(),
        productId: z.string(),
        ratingsSchame,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { username } = ctx;
      const { orderId, productId, ratingsSchame } = input;
      if (!username) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorize user",
        });
      }
      if (
        ratingsSchame.rating === undefined &&
        ratingsSchame.review === undefined
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Either ratings or reviews must be provided",
        });
      }
      const data = await db.order.findUnique({
        where: {
          id: orderId,
          username,
        },
        include: {
          OrderItems: {
            where: { productId },
          },
        },
      });
      if (!data) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "You are not purchase this product",
        });
      }
      try {
        const create = await db.ratings.create({
          data: {
            ratings: ratingsSchame.rating,
            reviews: ratingsSchame.review,
            orderId,
            productId,
            username,
          },
        });
        return create;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Something went wrong, ${error}`,
        });
      }
    }),

  getOneReviews: privateProcedure
    .input(z.object({ id: z.string(), order: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.username) {
        return;
      }
      try {
        const data = await db.ratings.findUnique({
          where: {
            productId_orderId: {
              orderId: input.order,
              productId: input.id,
            },
            username: ctx.username,
          },
          select: {
            order: {
              select: {
                OrderItems: {
                  where: { status: "DELIVERED" },
                },
              },
            },
            id: true,
            ratings: true,
            reviews: true,
          },
        });
        return data;
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `${error}`,
        });
      }
    }),
  updateRegiew: privateProcedure
    .input(
      z.object({
        id: z.string(),
        productId: z.string(),
        ratings: z.coerce.number().min(1).max(5).optional(),
        reviews: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { username } = ctx;
      const { id, productId, ratings, reviews } = input;
      if (!username) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorize user",
        });
      }
      if (ratings === undefined && reviews === undefined) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Either ratings or reviews must be provided",
        });
      }
      try {
        const updateReview = await db.ratings.update({
          where: { id, productId },
          data: {
            ratings,
            reviews,
          },
        });
        return updateReview;
      } catch (error) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: `${error}`,
        });
      }
    }),
  getAvgReview: baseProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const data = await db.ratings.aggregate({
        where: { productId: input.id, ratings: { not: null } },
        _avg: { ratings: true },
        _count: { ratings: true },
      });
      const groupedRatings = await db.ratings.groupBy({
        by: ["ratings"],
        where: { productId: input.id, ratings: { not: null } },
        _count: true,
      });

      const total = data._count.ratings ?? 0;

      const percentages = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };

      for (const item of groupedRatings) {
        const rating = item.ratings ?? 0;
        if (rating >= 1 && rating <= 5) {
          percentages[rating as 1 | 2 | 3 | 4 | 5] = Math.round(
            (item._count / total) * 100
          );
        }
      }
      console.log(data);
      console.log("Total", total, percentages);
      return { data, total, percentages };
    }),
});
