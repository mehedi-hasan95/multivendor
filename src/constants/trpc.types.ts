import { AppRouter } from "@/trpc/routers/_app";
import type { inferRouterOutputs } from "@trpc/server";
export type categoriesGetManyOutput =
  inferRouterOutputs<AppRouter>["categories"]["getMany"];

// export type Outputs = inferRouterOutputs<AppRouter>["categories"]["hello"]
