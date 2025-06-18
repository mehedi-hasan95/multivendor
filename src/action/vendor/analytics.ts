import { db } from "@/lib/db";
import { createTRPCRouter, privateProcedure } from "@/trpc/init";
// import { TRPCError } from "@trpc/server";
import {
  subMonths,
  startOfMonth,
  endOfMonth,
  // startOfYear,
  // endOfYear,
  // eachMonthOfInterval,
  // format,
} from "date-fns";

export const analyticsRouter = createTRPCRouter({
  analytics: privateProcedure.query(async ({ ctx }) => {
    const { username } = ctx;
    if (!username) return;

    const now = new Date();
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);

    const [
      thisMonthRevenue,
      lastMonthRevenue,
      totalRevenue,
      totalOrder,
      thisMonthOrder,
      lastMonthOrder,
      totalSold,
      thisMonthSold,
      lastMonthSold,
    ] = await Promise.all([
      db.$queryRaw<{ total: number }[]>`
      SELECT SUM(price * quantity) as total
      FROM "OrderItems"
      WHERE "sellerUsername" = ${username}
      AND "orderId" IN (
        SELECT id FROM "Order" 
        WHERE paid = true
        AND "createdAt" >= ${thisMonthStart}
        AND "createdAt" <= ${thisMonthEnd}
      )
    `,

      db.$queryRaw<{ total: number }[]>`
      SELECT SUM(price * quantity) as total
      FROM "OrderItems"
      WHERE "sellerUsername" = ${username}
      AND "orderId" IN (
        SELECT id FROM "Order" 
        WHERE paid = true
        AND "createdAt" >= ${lastMonthStart}
        AND "createdAt" <= ${lastMonthEnd}
      )
    `,
      db.$queryRaw<{ total: number }[]>`
      SELECT SUM(price * quantity) as total
      FROM "OrderItems"
      WHERE "sellerUsername" = ${username}
      AND "orderId" IN (
        SELECT id FROM "Order" WHERE paid = true
      )
    `,
      db.order.count({
        where: {
          paid: true,
          OrderItems: { every: { sellerUsername: username } },
        },
        select: { _all: true },
      }),
      db.order.count({
        where: {
          paid: true,
          OrderItems: { every: { sellerUsername: username } },
          createdAt: {
            gte: thisMonthStart,
            lte: thisMonthEnd,
          },
        },
        select: { _all: true },
      }),
      db.order.count({
        where: {
          paid: true,
          OrderItems: { every: { sellerUsername: username } },
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
        select: { _all: true },
      }),
      db.orderItems.aggregate({
        where: {
          sellerUsername: username,
          order: {
            paid: true,
          },
        },
        _sum: { quantity: true },
      }),
      db.orderItems.aggregate({
        where: {
          sellerUsername: username,
          order: {
            paid: true,
            createdAt: {
              gte: thisMonthStart,
              lte: thisMonthEnd,
            },
          },
        },
        _sum: { quantity: true },
      }),
      db.orderItems.aggregate({
        where: {
          sellerUsername: username,
          order: {
            paid: true,
            createdAt: {
              gte: lastMonthStart,
              lte: lastMonthEnd,
            },
          },
        },
        _sum: { quantity: true },
      }),
    ]);
    const current = thisMonthRevenue[0].total || 0;
    const previous = lastMonthRevenue[0].total || 0;

    const percentageChange =
      previous === 0 ? null : ((current - previous) / previous) * 100;
    const orderPercentageChange =
      previous === 0
        ? null
        : ((thisMonthOrder._all - lastMonthOrder._all) / lastMonthOrder._all) *
          100;

    const previousMonthSold = lastMonthSold._sum.quantity || 0;
    const soldPercentageChange =
      previousMonthSold === 0
        ? null
        : (((thisMonthSold._sum.quantity as number) -
            (previousMonthSold ?? 0)) /
            previousMonthSold) *
          100;
    return {
      totalRevenue: totalRevenue[0].total ?? 0,
      thisMonthRevenue,
      percentageChange,
      totalOrder,
      orderPercentageChange,
      totalSold,
      soldPercentageChange,
    };
  }),
  // monthlyAnalytics: privateProcedure.query(async ({ ctx }) => {
  //   try {
  //     const { username } = ctx;
  //     if (!username) return;
  //     const currentDate = new Date();
  //     const yearStart = startOfYear(currentDate);
  //     const yearEnd = endOfYear(currentDate);

  //     // Get all months in the current year
  //     const months = eachMonthOfInterval({
  //       start: yearStart,
  //       end: yearEnd,
  //     });

  //     // Get delivered/shipped orders for the current year
  //     const orderItems = await db.orderItems.findMany({
  //       where: {
  //         order: { paid: true },
  //         sellerUsername: username,
  //         createdAt: {
  //           gte: yearStart,
  //           lte: yearEnd,
  //         },
  //       },
  //       select: {
  //         price: true,
  //         quantity: true,
  //         createdAt: true,
  //       },
  //     });

  //     // Initialize monthly data
  //     const monthlyData = months.map((month) => ({
  //       name: format(month, "MMM"),
  //       monthNumber: month.getMonth(),
  //       revenue: 0,
  //       itemsSold: 0,
  //     }));

  //     // Aggregate data by month
  //     orderItems.forEach((item) => {
  //       const month = item.createdAt.getMonth();
  //       monthlyData[month].revenue += item.price * item.quantity;
  //       monthlyData[month].itemsSold += item.quantity;
  //     });

  //     // Format the response for the chart
  //     const chartData = monthlyData.map((month) => ({
  //       name: month.name,
  //       revenue: month.revenue,
  //       itemsSold: month.itemsSold,
  //     }));

  //     return chartData;
  //   } catch (error) {
  //     throw new TRPCError({
  //       code: "INTERNAL_SERVER_ERROR",
  //       message: `Failed to fetch monthly sales data, ${error}`,
  //     });
  //   }
  // }),
});
