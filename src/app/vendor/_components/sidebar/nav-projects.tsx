"use client";

import { Collapsible } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BarChart3, Home, Package, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/vendor",
    isActive: true,
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    url: "/vendor/orders",
  },
  {
    title: "Products",
    icon: Package,
    url: "/vendor/products",
  },
  {
    title: "Billing & Analytics",
    icon: BarChart3,
    url: "/vendor/billing",
  },
];
export function NavProjects() {
  const pathName = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {navigationItems.map((item) => (
          <Collapsible asChild className="group/collapsible" key={item.title}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathName === item.url}>
                <Link href={item.url} className="flex items-center gap-2">
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
