"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  value?: string[] | null;
  onChange: (value: string[]) => void;
}
export const TagFilters = ({ onChange, value }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.tags.getMany.queryOptions());
  const onClick = (tag: string) => {
    if (value?.includes(tag)) {
      onChange(value.filter((t) => t !== tag) || []);
    } else {
      onChange([...(value || []), tag]);
    }
  };
  return (
    <div className="flex flex-col gap-2">
      {data.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center cursor-pointer"
          onClick={() => onClick(item.slug)}
        >
          <p>{item.name}</p>
          <Checkbox
            checked={value?.includes(item.slug)}
            onCheckedChange={() => onClick(item.slug)}
          />
        </div>
      ))}
    </div>
  );
};
