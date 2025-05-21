"use client";
import { HeaderTitle } from "@/components/common/header-title";
import GlassCard from "@/components/generated/glass-card";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";

const VendorProductPage = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.products.getMany.queryOptions());
  return (
    <div>
      <HeaderTitle
        title="Your Products"
        description="All of your product will shown here"
        linkText="Create New"
        linkHref="/vendor/products/new"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        {data.map((product) => (
          <GlassCard key={product.id}>
            <h2>{product.title}</h2>
            <Image
              src={product?.images[0].url}
              alt=""
              className="h-auto aspect-video"
              height={400}
              width={400}
            />
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default VendorProductPage;
