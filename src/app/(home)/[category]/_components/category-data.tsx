"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";

export const CategoryData = () => {
  const params = useParams();
  const categoryParam = params.category as string | undefined;

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.categories.getMany.queryOptions({ category: categoryParam })
  );
  return (
    <>
      {data.map((product) => (
        <div
          key={product.id}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5"
        >
          {product.SubCategories.map((item) => (
            <div key={item.id}>
              {item.Products.map((c) => (
                <div key={c.id}>
                  <Image
                    src={c.images[0]?.url as string}
                    alt=""
                    height={400}
                    width={500}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </>
  );
};
