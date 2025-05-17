import { Logo } from "@/components/common/logo";
import { NavMenu } from "./nav-menu";
import { HomeAuth } from "./home-auth";
import { HomeNavMobile } from "./home-nav-mobile";
import { SearchFilters } from "../search/search-filters";

export const HomeHeaders = () => {
  return (
    <header className="">
      <div className="flex justify-between items-center">
        <Logo />
        <NavMenu />
        <HomeAuth />
        <HomeNavMobile />
      </div>
      <SearchFilters />
    </header>
  );
};
