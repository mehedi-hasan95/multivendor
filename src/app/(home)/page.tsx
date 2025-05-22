"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ProductCard } from "./_components/common/product-card";

export default function Home() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.products.getMany.queryOptions({}));
  return (
    <div>
      <ProductCard data={data} />
    </div>
  );
}
