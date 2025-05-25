import { db } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const tagsRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const tags = db.tags.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return tags;
  }),
});
