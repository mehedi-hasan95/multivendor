import { db } from "@/lib/db";
import { tagSchema } from "@/schemas/schemas";
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
  create: baseProcedure.input(tagSchema).mutation(async ({ input }) => {
    try {
      const { name, slug } = input;

      // Check uniqueness
      const existingTag = await db.tags.findFirst({
        where: {
          OR: [{ name }, { slug }],
        },
      });
      if (existingTag) {
        throw new Error(
          existingTag.name === name
            ? "Tag name already exists"
            : "Tag slug already exists"
        );
      }
      const tag = await db.tags.create({
        data: { name, slug },
      });
      return { success: "Tag created successfully", tag };
    } catch (error) {
      return { error: "Something went wrong", ot: error };
    }
  }),
});
