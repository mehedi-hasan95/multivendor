import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Footer } from "../../(home)/_components/common/footer";
import { TenentNav, TenentNavSkeleton } from "../_components/tenent-nav";
import { Suspense } from "react";

interface Props {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}
const TenantsLayout = async ({ children, params }: Props) => {
  const { slug } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.user.singleTenant.queryOptions({
      username: slug,
    })
  );

  return (
    <div className="flex flex-col min-h-screen mx-4 lg:mx-12">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<TenentNavSkeleton />}>
          <TenentNav username={slug} />
        </Suspense>
      </HydrationBoundary>
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default TenantsLayout;
