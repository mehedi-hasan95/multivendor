import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { createTRPCRouter, privateProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

export const stripeRouter = createTRPCRouter({
  getStripeConnectId: privateProcedure.query(async ({ ctx }) => {
    if (!ctx.username) {
      return;
    }
    const data = await db.user.findUnique({
      where: { email: ctx.userEmail },
      select: { stripeConnectLink: true },
    });
    return data;
  }),
  createStripeConnectLink: privateProcedure.mutation(async ({ ctx }) => {
    if (!ctx.username) {
      return;
    }
    const user = await db.user.findUnique({
      where: { email: ctx.userEmail },
      select: { stripeConnectId: true },
    });
    if (!user?.stripeConnectId) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No Stripe Connect ID found",
      });
    }

    const data = await stripe.accountLinks.create({
      account: user.stripeConnectId,
      type: "account_onboarding",
      refresh_url: `${process.env.NEXT_PUBLIC_URL}/vendor/billing?failed=true`,
      return_url: `${process.env.NEXT_PUBLIC_URL}/vendor/billing?success=true`,
    });
    return { url: data.url };
  }),
});
