"use client";

import { Badge } from "@/components/ui/badge";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const TagItems = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.tags.getMany.queryOptions());
  if (data.length < 1) {
    return <p>No tags created</p>;
  }
  return (
    <div className="flex gap-2 flex-wrap">
      {data.map((item) => (
        <div key={item.id} className="flex flex-wrap gap-3">
          <Badge className="capitalize">{item.name}</Badge>
        </div>
      ))}
    </div>
  );
};
