"use client";

import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/common/logo";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function TeamSwitcher() {
  const { state } = useSidebar();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className={cn("flex justify-between items-center")}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  {state === "expanded" ? (
                    <Logo className="font-bold text-xs" />
                  ) : (
                    <Link href={"/"}>Nestify</Link>
                  )}
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
