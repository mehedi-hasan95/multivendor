"use client";

import { SheetModify } from "@/components/common/sheet-modify";
import { usePathname } from "next/navigation";
import { AUTH_NAV_ITEMS, HOME_NAV_ITEMS } from "./home-nav-constants";
import { SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { authSessionUser } from "@/lib/auth-session-user";
import { SignOutButton } from "@/app/(auth)/_components/sign-out";

export const HomeNavMobile = () => {
  const pathName = usePathname();
  const session = authSessionUser();
  return (
    <SheetModify className="lg:hidden">
      <div className="flex flex-col gap-y-1.5 bg-themeBlack gap-x-2 bg-clip-padding backdrop--blur__safari backdrop-filter backdrop-blur-2xl bg-opacity-60">
        {HOME_NAV_ITEMS.map((item) => (
          <SheetClose asChild key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "rounded-full  px-1.5 py-2 hover:bg-slate-900 hover:dark:bg-slate-900 border text-white font-medium",
                pathName === item.href && "iconBackground",
                session.session?.user.role !== "admin" &&
                  item.href === "/admin" &&
                  "hidden"
              )}
            >
              {item.label}
            </Link>
          </SheetClose>
        ))}
        {session.session?.session.token ? (
          <SignOutButton />
        ) : (
          AUTH_NAV_ITEMS.map((item) => (
            <SheetClose asChild key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "text-white font-medium",
                  "rounded-full  px-1.5 py-2 hover:bg-slate-900 hover:dark:bg-slate-900 border"
                )}
              >
                {item.label}
              </Link>
            </SheetClose>
          ))
        )}
      </div>
    </SheetModify>
  );
};
