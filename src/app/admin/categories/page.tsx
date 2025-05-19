import { HeaderTitle } from "@/components/common/header-title";
import { CategoryItems } from "./[slug]/_components/categories-items";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { LoadingSkeleton } from "@/app/(home)/_components/common/loading-skeleton";

const CategoriesPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());
  return (
    <div>
      <HeaderTitle
        linkHref={"/admin/categories/new"}
        linkText="Create Category"
        title="Categories"
        description="Create and manage categories."
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<LoadingSkeleton items={8} />}>
          <CategoryItems />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
};

export default CategoriesPage;
