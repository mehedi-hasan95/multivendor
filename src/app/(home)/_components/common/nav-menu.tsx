"use client";

import Link from "next/link";
import { HOME_NAV_ITEMS } from "./home-nav-constants";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { authSessionUser } from "@/lib/auth-session-user";

export const NavMenu = () => {
  const pathName = usePathname();
  const session = authSessionUser();
  return (
    <nav className="lg:flex px-5 py-3 items-center bg-themeBlack gap-x-2 bg-clip-padding backdrop--blur__safari backdrop-filter backdrop-blur-2xl bg-opacity-60 hidden">
      {HOME_NAV_ITEMS.map((item) => (
        <Link href={item.href} key={item.href}>
          <Button
            variant={"outline"}
            className={cn(
              "",
              pathName === item.href && "iconBackground",
              session.session?.user.role !== "admin" &&
                item.href === "/admin" &&
                "hidden",
              session.session?.user.role !== "admin" &&
                session.session?.user.role !== "vendor" &&
                item.href === "/vendor" &&
                "hidden"
            )}
          >
            {item.label}
          </Button>
        </Link>
      ))}
    </nav>
  );
};
