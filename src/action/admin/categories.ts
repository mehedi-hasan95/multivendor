import { db } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const categories = await db.categories.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        SubCategories: true,
      },
    });
    return categories;
  }),
});
