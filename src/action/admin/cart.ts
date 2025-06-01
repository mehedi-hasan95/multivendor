import { authSession } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { baseProcedure, createTRPCRouter, privateProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const cartRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        productId: z.string(),
        quantity: z.number().min(1).max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { username } = ctx;
      if (!username) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to add items to the cart.",
        });
      }
      const cart = await db.cart.create({
        data: {
          productId: input.productId,
          quantity: input.quantity,
          username,
        },
      });
      return cart;
    }),

  getCart: baseProcedure.query(async () => {
    const session = await authSession();
    const username = session?.user.username;

    if (!username) {
      return [];
    }
    const cartItems = await db.cart.findMany({
      where: { username },
      include: {
        product: {
          include: { images: { select: { url: true } } },
        },
      },
    });
    return cartItems;
  }),
  removeCart: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { username } = ctx;
      if (!username) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to remove items from the cart.",
        });
      }
      const cartItem = await db.cart.findUnique({
        where: { id: input.id },
      });
      if (!cartItem || cartItem.username !== username) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cart item not found or does not belong to the user.",
        });
      }
      await db.cart.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
