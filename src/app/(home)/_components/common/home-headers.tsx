import { Logo } from "@/components/common/logo";
import { NavMenu } from "./nav-menu";
import { HomeAuth } from "./home-auth";
import { HomeNavMobile } from "./home-nav-mobile";

export const HomeHeaders = () => {
  return (
    <header className="flex justify-between items-center">
      <Logo />
      <NavMenu />
      <HomeAuth />
      <HomeNavMobile />
    </header>
  );
};
