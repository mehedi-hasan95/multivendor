// import { stripe } from "@/lib/stripe";
// import { NextResponse } from "next/server";
// import Stripe from "stripe";

// export async function POST(req: Request) {
//   let event: Stripe.Event;
//   try {
//     event = stripe.webhooks.constructEvent(
//       await (await req.blob()).text(),
//       req.headers.get("stripe-signature") as string,
//       process.env.STRIPE_WEBHOOK_SECRET!
//     );
//   } catch (error) {
//     const errorMessage =
//       error instanceof Error ? error.message : "Unknown error";
//     if (error! instanceof Error) {
//       console.log(error);
//     }
//     console.log(`Error Message: ${errorMessage}`);
//     return NextResponse.json(
//       { message: `Webhook Error: ${errorMessage}` },
//       { status: 400 }
//     );
//   }
//   console.log("Success: ", event.id);
//   const permittedEvents: string[] = ["checkout.session.completed"];
//   if (permittedEvents.includes(event.type)) {
//     let data;
//     try {
//       switch (event.type) {
//         case "checkout.session.completed":
//           data = event.data.object as Stripe.Checkout.Session;
//           console.log(data.metadata);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }

// src/app/api/webhook/route.ts
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
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
    // return new NextResponse("Webhook error", { status: 400 });
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    if (error! instanceof Error) {
      console.log(error);
    }
    console.log(`Error Message: ${errorMessage}`);
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Extract metadata from the session
    const { orderId, username } = session.metadata || {};

    const orderIds = JSON.parse(orderId as string);
    console.log(orderIds);

    // Here you can add logic to update your database
    // For example, create an order record, clear the cart, etc.
    if (username) {
      try {
        const data = await db.order.findUnique({
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
                status: true,
              },
            },
          },
        });
        if (data) {
          // Update an order in your database
          await db.order.update({
            where: {
              id: data.id,
              username,
            },
            data: {
              paid: true,
              paymentId: session.payment_intent as string,
            },
          });

          for (const item of data?.OrderItems) {
            await db.products.update({
              where: {
                id: item.productId,
              },
              data: {
                sale: {
                  increment: item.quantity,
                },
              },
            });
          }
        }

        // Clear the user's cart
        await db.cart.deleteMany({
          where: {
            username,
          },
        });
      } catch (error) {
        console.error("Error processing order:", error);
      }
    }
  }

  return new NextResponse(null, { status: 200 });
}
