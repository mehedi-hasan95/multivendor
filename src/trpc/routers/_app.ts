import { productRouter } from "@/action/admin/products";
import { createTRPCRouter } from "../init";
import { categoriesRouter } from "@/action/admin/categories";
export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  products: productRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
