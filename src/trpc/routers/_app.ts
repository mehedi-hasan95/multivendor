import { productRouter } from "@/action/admin/products";
import { createTRPCRouter } from "../init";
import { categoriesRouter } from "@/action/admin/categories";
import { tagsRouter } from "@/action/admin/tags";
import { userRouter } from "@/action/user/user";
import { cartRouter } from "@/action/user/cart";
import { wishlistRouter } from "@/action/user/wishlist";
export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  products: productRouter,
  tags: tagsRouter,
  user: userRouter,
  cart: cartRouter,
  wishlist: wishlistRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
