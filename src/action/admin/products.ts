import { authSession } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { productSchema } from "@/schemas/schemas";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { revalidatePath } from "next/cache";

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
          sellerId: session.user.id,
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
      return { error: "Something went wrong", ot: error };
    }
  }),
  getMany: baseProcedure.query(async () => {
    const session = await authSession();
    const products = await db.products.findMany({
      where: {
        sellerId: session?.user.id,
      },
      include: { images: true },
      orderBy: { createdAt: "asc" },
    });
    return products;
  }),
});
