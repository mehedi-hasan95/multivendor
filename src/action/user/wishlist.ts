import { authSession } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { baseProcedure, createTRPCRouter, privateProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const wishlistRouter = createTRPCRouter({
  addWishlist: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { username } = ctx;
      if (!username) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to add items to the cart.",
        });
      }
      const { id } = input;
      const existingWishlist = await db.wishlist.findFirst({
        where: { username: username, productId: id },
      });
      if (existingWishlist) {
        await db.wishlist.delete({
          where: { id: existingWishlist.id, username: username },
        });
      } else {
        await db.wishlist.create({
          data: { username: username, productId: id },
        });
      }
    }),
  getWishlist: baseProcedure.query(async () => {
    const session = await authSession();
    const username = session?.user.username;
    if (!username) {
      return [];
    }
    const wishlist = await db.wishlist.findMany({
      where: { username: username },
      include: {
        product: {
          include: {
            images: { select: { url: true } },
            seller: { select: { username: true, name: true, image: true } },
          },
        },
      },
    });
    return wishlist;
  }),
});
