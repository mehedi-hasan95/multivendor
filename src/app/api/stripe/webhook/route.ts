import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { TRPCError } from "@trpc/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("Stripe webhook error:", errorMessage);
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  // ✅ Handle Stripe Connect account updated
  if (event.type === "account.updated") {
    const account = event.data.object as Stripe.Account;
    try {
      const user = await db.user.findUnique({
        where: { stripeConnectId: account.id },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No user found for Stripe Connect ID",
        });
      } else {
        await db.user.update({
          where: { id: user.id },
          data: {
            stripeConnectLink: account.charges_enabled, // true or false
          },
        });
      }
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Error updating stripeConnectLink",
        cause: error,
      });
    }
  }

  // ✅ Handle Checkout session completed (payment success)
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const { orderId, username } = session.metadata || {};
    const orderIds = JSON.parse(orderId || "null");

    if (username && orderIds) {
      try {
        const order = await db.order.findUnique({
          where: {
            id: orderIds,
            username,
          },
          select: {
            id: true,
            OrderItems: {
              select: {
                id: true,
                quantity: true,
                productId: true,
              },
            },
          },
        });

        if (order) {
          await db.order.update({
            where: {
              id: order.id,
              username,
            },
            data: {
              paid: true,
              paymentId: session.payment_intent as string,
            },
          });

          for (const item of order.OrderItems) {
            await db.products.update({
              where: { id: item.productId },
              data: {
                sale: { increment: item.quantity },
              },
            });

            await db.orderItems.update({
              where: { id: item.id },
              data: {
                status: "PROCESSING",
              },
            });
          }
        }

        // Clear user's cart
        await db.cart.deleteMany({
          where: { username },
        });

        revalidatePath("/cart");
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error processing checkout.session.completed",
          cause: error,
        });
      }
    }
  }

  return new NextResponse(null, { status: 200 });
}
