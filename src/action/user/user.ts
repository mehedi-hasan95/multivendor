import { db } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  singleTenant: baseProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      try {
        const tenant = await db.user.findUnique({
          where: {
            username: input.username,
          },
          select: {
            username: true,
            image: true,
          },
        });
        return tenant;
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
          cause: error,
        });
      }
    }),
});
