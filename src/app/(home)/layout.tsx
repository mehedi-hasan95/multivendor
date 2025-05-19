import { getQueryClient, trpc } from "@/trpc/server";
import { Footer } from "./_components/common/footer";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { HomeSkeleton } from "./_components/common/loading-skeleton";
import { SearchFilters } from "./_components/search/search-filters";
import { Navbar } from "./_components/common/navbar";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());
  return (
    <div className="flex flex-col justify-between min-h-screen">
      <Navbar />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<HomeSkeleton />}>
          <SearchFilters />
        </Suspense>
      </HydrationBoundary>
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default HomeLayout;
