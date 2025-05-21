import { BreadcrumbModify } from "@/components/common/breadcrumb-modify";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/sidebar/app-sidebar";
import { authSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface AdminLayoutProps {
  children: React.ReactNode;
}
const AdminLayout = async ({ children }: AdminLayoutProps) => {
  const session = await authSession();
  if (session?.user.role !== "admin") {
    redirect("/");
  }
  const queryClient = getQueryClient();
  // todo : type any
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions(session?.user?.id as any)
  );
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <BreadcrumbModify />
          </div>
        </header>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </HydrationBoundary>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
