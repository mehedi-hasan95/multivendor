import { productRouter } from "@/action/admin/products";
import { createTRPCRouter } from "../init";
import { categoriesRouter } from "@/action/admin/categories";
import { tagsRouter } from "@/action/admin/tags";
export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  products: productRouter,
  tags: tagsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
