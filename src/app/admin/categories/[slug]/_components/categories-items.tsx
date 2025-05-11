"use client";

import { ChevronRight } from "lucide-react";

import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Categories } from "@/generated/prisma";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface CategoryItemsProps {
  categories: Categories[];
}
export function CategoryItems({ categories }: CategoryItemsProps) {
  return (
    <SidebarMenu className="grid md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
      {categories.map((item) => (
        <Card key={item.slug}>
          <CardContent>
            <Collapsible key={item.slug} asChild className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.name}
                    className="cursor-pointer"
                  >
                    {item.color && (
                      <div
                        className="size-6 rounded-md"
                        style={{ backgroundColor: item.color }}
                      />
                    )}
                    <Link href={`/admin/categories/${item.slug}`}>
                      {item.name}
                    </Link>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {/* <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent> */}
              </SidebarMenuItem>
            </Collapsible>
          </CardContent>
        </Card>
      ))}
    </SidebarMenu>
  );
}
