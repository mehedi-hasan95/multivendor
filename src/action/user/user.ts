import { authClient } from "@/lib/auth-client";
import { db } from "@/lib/db";
import { registerSchema } from "@/schemas/auth.schemas";
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
  createUser: baseProcedure
    .input(registerSchema)
    .mutation(async ({ input }) => {
      try {
        const user = await authClient.signUp.email({
          name: input.name,
          email: input.email,
          username: input.username,
          password: input.password,
          role: input.role,
        });
        if (user.error?.code === "USER_ALREADY_EXISTS") {
          const data = await db.user.findUnique({
            where: { email: input.email, emailVerified: false },
          });
          return data;
        }
        const updatedUser = await db.user.update({
          where: { id: user.data?.user.id },
          data: {
            role: input.role,
          },
        });
        return updatedUser;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user",
          cause: error,
        });
      }
    }),
});
