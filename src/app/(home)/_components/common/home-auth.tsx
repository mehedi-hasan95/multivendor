"use client";

import Link from "next/link";
import { AUTH_NAV_ITEMS } from "./home-nav-constants";
import { Button } from "@/components/ui/button";

export const HomeAuth = () => {
  return (
    <nav className="hidden lg:flex px-5 py-3 items-center bg-themeBlack gap-x-2 bg-clip-padding backdrop--blur__safari backdrop-filter backdrop-blur-2xl bg-opacity-60">
      {AUTH_NAV_ITEMS.map((item) => (
        <Link href={item.href} key={item.href}>
          <Button variant={"outline"}>{item.label}</Button>
        </Link>
      ))}
    </nav>
  );
};
