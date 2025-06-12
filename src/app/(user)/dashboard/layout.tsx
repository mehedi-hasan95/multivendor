import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "./_components/main/dashboard-sidebar";
import { Separator } from "@/components/ui/separator";
import { authSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";

interface Props {
  children: React.ReactNode;
}
const DashboardLayou = async ({ children }: Props) => {
  const auth = await authSession();
  if (!auth?.session.token) {
    redirect("/login");
  }
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
        </header>
        <div className="px-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayou;
