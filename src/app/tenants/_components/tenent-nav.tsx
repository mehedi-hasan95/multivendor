"use client";

import { Logo } from "@/components/common/logo";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { generateTenentUrl } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

interface Props {
  username: string;
}
export const TenentNav = ({ username }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.user.singleTenant.queryOptions({ username })
  );

  if (!data) {
    redirect("/");
  }
  return (
    <>
      <div className="flex items-center justify-between pt-5">
        <Link
          href={generateTenentUrl(data.username)}
          className="flex gap-2 items-center"
        >
          <Image
            src={data.image || "https://github.com/shadcn.png"}
            alt={data.username}
            height={32}
            width={32}
            className="rounded-full"
          />
          <div className="font-medium text-xl">{data.username}</div>
        </Link>
        <Logo />
      </div>
      <Separator className="mt-3" />
    </>
  );
};

export const TenentNavSkeleton = () => {
  return (
    <div className="flex flex-col py-3">
      <div className="font-medium text-xl">
        <Skeleton className="h-3 w-5" />
      </div>
      <Separator className="mt-3" />
    </div>
  );
};
