import { AppRouter } from "@/trpc/routers/_app";
import type { inferRouterOutputs } from "@trpc/server";
export type categoriesGetManyOutput =
  inferRouterOutputs<AppRouter>["categories"]["getMany"];

export type productCreateOutput =
  inferRouterOutputs<AppRouter>["products"]["create"];
export type productBySeller =
  inferRouterOutputs<AppRouter>["products"]["getManyBySeller"];

export type productGetMany =
  inferRouterOutputs<AppRouter>["products"]["getMany"];

export type productGetOne = inferRouterOutputs<AppRouter>["products"]["getOne"];
export type addToCartOutput = inferRouterOutputs<AppRouter>["cart"]["create"];
export type cartGetCartOutput =
  | inferRouterOutputs<AppRouter>["cart"]["getCart"]
  | [];
export type updateCartOutput =
  inferRouterOutputs<AppRouter>["cart"]["updateCart"];

export type getWishlistOutput =
  | inferRouterOutputs<AppRouter>["wishlist"]["getWishlist"];
