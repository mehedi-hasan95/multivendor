import { HeaderTitle } from "@/components/common/header-title";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { LoadingSkeleton } from "@/app/(home)/_components/common/loading-skeleton";
import { TagItems } from "./_components/tag-items";

const CategoriesPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.tags.getMany.queryOptions());
  return (
    <div>
      <HeaderTitle
        linkHref={"/admin/tags/new"}
        linkText="Create Tags"
        title="Tags"
        description="Create and manage tags."
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<LoadingSkeleton items={8} />}>
          <TagItems />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
};

export default CategoriesPage;
