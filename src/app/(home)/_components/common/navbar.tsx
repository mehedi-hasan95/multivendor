import { Logo } from "@/components/common/logo";
import { NavMenu } from "./nav-menu";
import { HomeAuth } from "./home-auth";
import { HomeNavMobile } from "./home-nav-mobile";

export const Navbar = () => {
  return (
    <header className="flex justify-between items-center px-4 lg:px-12">
      <Logo />
      <NavMenu />
      <HomeAuth />
      <HomeNavMobile />
    </header>
  );
};
