import { DEFAULT_LIMIT } from "@/constants/default";
import { sortValues } from "@/constants/nuqs/search-params";
import { authSession } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { productSchema } from "@/schemas/schemas";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const productRouter = createTRPCRouter({
  create: baseProcedure.input(productSchema).mutation(async ({ input }) => {
    try {
      const session = await authSession();
      if (session?.user.role !== "admin" && session?.user.role !== "vendor")
        return { error: "Unauthorize user" };
      const validateField = productSchema.safeParse(input);
      if (!validateField.success) return { error: "Something went wrong" };
      const {
        basePrice,
        categoryId,
        description,
        hasDiscount,
        price,
        subCategoryId,
        title,
        discount,
        discountcode,
        stock,
        images,
        tagSlug,
      } = validateField.data;
      const product = await db.products.create({
        data: {
          basePrice,
          categoryId,
          description,
          hasDiscount,
          price,
          subCategoryId,
          title,
          discount,
          discountcode,
          stock,
          sellerUserName: session.user.username as string,
          tagSlug,
          images: {
            createMany: {
              data: [...images.map((images: { url: string }) => images)],
            },
          },
        },
      });
      revalidatePath("/vendor/products");
      return product;
    } catch (error) {
      // return { error: "Something went wrong", ot: error };
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
        cause: error,
      });
    }
  }),
  getManyBySeller: baseProcedure.query(async () => {
    const session = await authSession();
    const products = await db.products.findMany({
      where: {
        sellerUserName: session?.user.username as string,
      },
      include: { images: true },
      orderBy: { createdAt: "asc" },
    });
    return products;
  }),
  getMany: baseProcedure
    .input(
      z.object({
        category: z.string().optional(),
        subCategory: z.string().optional(),
        minPrice: z.string().optional(),
        maxPrice: z.string().optional(),
        tags: z.array(z.string()).nullable().optional(),
        sort: z.enum(sortValues).nullable().optional(),

        cursor: z.string().nullish(),
        limit: z.number().default(DEFAULT_LIMIT),
        sellerUserName: z.string().nullable().optional(),
      })
    )

    .query(async ({ input }) => {
      const products = await db.products.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        skip: input.cursor ? 1 : 0,
        where: {
          sellerUserName: {
            equals: input.sellerUserName || undefined,
          },
          categoryId: input.category,
          subCategoryId: input.subCategory,
          price: {
            gte: input.minPrice ? parseFloat(input.minPrice) : undefined,
            lte: input.maxPrice ? parseFloat(input.maxPrice) : undefined,
          },
          tags:
            input.tags && input.tags.length > 0
              ? {
                  slug: {
                    in: input.tags,
                  },
                }
              : undefined,
        },
        orderBy: {
          createdAt:
            input.sort === "best_seller"
              ? "desc"
              : input.sort === "hot_and_new"
              ? "asc"
              : undefined,
        },
        include: {
          images: true,
          seller: {
            select: {
              name: true,
              username: true,
              image: true,
            },
          },
        },
      });
      const hasMore = products.length > input.limit;
      const items = hasMore ? products.slice(0, -1) : products;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore ? lastItem.id : null;
      return {
        products: items,
        nextCursor,
      };
    }),
});
