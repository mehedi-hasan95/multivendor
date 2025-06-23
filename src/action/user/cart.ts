import { OrderStatus } from "@/generated/prisma";
import { authSession } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { purchaseSchema } from "@/schemas/schemas";
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
  updateCart: privateProcedure
    .input(z.object({ id: z.string(), quantity: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { username } = ctx;
      if (!username) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to update items in the cart.",
        });
      }
      const { id, quantity } = input;
      if (quantity < 1 || quantity > 100) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Quantity must be between 1 and 100.",
        });
      }
      const cartItem = await db.cart.findUnique({
        where: { id },
      });
      if (!cartItem || cartItem.username !== username) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cart item not found or does not belong to the user.",
        });
      }
      const updatedCartItem = await db.cart.update({
        where: { id },
        data: { quantity },
      });
      return updatedCartItem;
    }),
  purchase: privateProcedure
    .input(
      z.object({
        cartItems: z.array(purchaseSchema),
        shippingMethod: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { cartItems, shippingMethod } = input;
      const { username, userEmail } = ctx;
      if (!username) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Unauthorize access",
        });
      }
      const inCart = await db.cart.findMany({
        where: {
          productId: {
            in: cartItems.map((item) => item.productId),
          },
          username,
        },
      });
      if (inCart.length !== cartItems.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Some products in your cart are no longer available",
        });
      }

      const orderData = await db.order.create({
        data: {
          username,
          shipping: shippingMethod,
          OrderItems: {
            create: cartItems.map((item) => ({
              price: item.price,
              productId: item.productId,
              sellerUsername: item.sellerUserName,
              quantity: item.quantity,
            })),
          },
        },
      });
      const shippingCost =
        shippingMethod === "express"
          ? 15.99
          : shippingMethod === "overnight"
          ? 29.99
          : 0;

      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          line_items: cartItems.map((item) => ({
            price_data: {
              currency: "USD",
              product_data: {
                name: item.title,
                images: item.imageUrl ? [item.imageUrl] : [],
              },
              unit_amount: Math.round(item.price * 100), // Stripe uses cents
            },
            quantity: item.quantity,
          })),
          shipping_options: [
            {
              shipping_rate_data: {
                type: "fixed_amount",
                fixed_amount: {
                  amount: Math.round(shippingCost * 100),
                  currency: "usd",
                },
                display_name:
                  shippingMethod === "express"
                    ? "Express Shipping"
                    : shippingMethod === "overnight"
                    ? "Overnight Shipping"
                    : "Standard Shipping",
                delivery_estimate: {
                  minimum: {
                    unit: "business_day",
                    value:
                      shippingMethod === "overnight"
                        ? 1
                        : shippingMethod === "express"
                        ? 2
                        : 5,
                  },
                  maximum: {
                    unit: "business_day",
                    value:
                      shippingMethod === "overnight"
                        ? 1
                        : shippingMethod === "express"
                        ? 3
                        : 7,
                  },
                },
              },
            },
          ],
          metadata: {
            username,
            orderId: JSON.stringify(orderData.id),
          },
          payment_intent_data: {
            application_fee_amount: 100,
            transfer_data: {
              destination: "",
            },
          },
          customer_email: userEmail,
          success_url: `${process.env.NEXT_PUBLIC_URL}/cart?success=true`,
          cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart?cancel=true`,
        });

        return { url: session.url };
      } catch (error) {
        console.error("Stripe error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }
    }),

  getSummary: privateProcedure.query(async ({ ctx }) => {
    const { username } = ctx;
    if (!username) return;

    const [totalOrder, totalActiveOrder, activeOrder, totalSpent] =
      await Promise.all([
        db.order.count({
          where: { paid: true, username },
        }),
        db.orderItems.count({
          where: {
            status: {
              in: ["PROCESSING", "SHIPPED"],
            },
            order: {
              paid: true,
              username,
            },
          },
        }),
        db.orderItems.groupBy({
          by: ["status"],
          where: {
            status: {
              in: ["PROCESSING", "SHIPPED"],
            },
            order: {
              paid: true,
              username,
            },
          },
          _count: {
            _all: true,
          },
        }),
        db.$queryRaw<{ total: number }[]>`
          SELECT SUM("price" * "quantity") as total
          FROM "OrderItems"
          WHERE "orderId" IN (
            SELECT "id" FROM "Order" 
            WHERE "paid" = true AND "username" = ${username}
          )
        `,
      ]);

    return {
      totalOrder,
      totalActiveOrder,
      activeOrder,
      totalSpent: totalSpent[0].total,
    };
  }),
  latestOrder: privateProcedure
    .input(z.object({ limit: z.coerce.number().optional() }))
    .query(async ({ ctx, input }) => {
      const { username } = ctx;
      if (!username) {
        return [];
      }
      const data = await db.orderItems.findMany({
        where: {
          order: {
            paid: true,
            username,
          },
        },
        select: {
          order: {
            select: { id: true, shipping: true, createdAt: true },
          },
          price: true,
          status: true,
          user: {
            select: { email: true },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: input.limit,
      });
      return data;
    }),
  allOrders: privateProcedure
    .input(
      z.object({
        shipping: z
          .enum([
            OrderStatus.DELIVERED,
            OrderStatus.PROCESSING,
            OrderStatus.SHIPPED,
          ])
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { username } = ctx;
      if (!username) {
        return [];
      }
      const orders = await db.order.findMany({
        where: {
          paid: true,
          username,
        },
        select: {
          id: true,
          _count: { select: { OrderItems: true } },
          createdAt: true,
          OrderItems: {
            where: {
              status: input.shipping,
            },
            select: {
              id: true,
              price: true,
              quantity: true,
              status: true,
              product: {
                select: {
                  id: true,
                  title: true,
                  images: {
                    select: { url: true },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return orders;
    }),
});
