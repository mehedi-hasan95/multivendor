import { db } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        category: z.string().optional(),
        subCategory: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const categories = await db.categories.findMany({
        where: {
          slug: input.category,
        },
        orderBy: {
          name: "asc",
        },
        include: {
          SubCategories: {
            where: {
              slug: input.subCategory,
            },
            include: {
              Products: {
                include: {
                  images: true,
                },
              },
            },
          },
        },
      });
      return categories;
    }),
});
