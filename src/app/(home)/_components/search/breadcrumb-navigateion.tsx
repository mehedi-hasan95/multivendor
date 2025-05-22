import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import Link from "next/link";

interface Props {
  activeCategory?: string | null;
  activeCategoryName?: string | null;
  subCategoryName?: string | null;
}
export const BreadcrumbNavigation = ({
  activeCategory,
  activeCategoryName,
  subCategoryName,
}: Props) => {
  if (!activeCategoryName || activeCategory === "all") return null;
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {subCategoryName ? (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/`} className="capitalize font-semibold text-base">
                  <Home />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={`/${activeCategory}`}
                  className="capitalize font-semibold text-base"
                >
                  {activeCategoryName}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize font-semibold text-base">
                {subCategoryName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/`} className="capitalize font-semibold text-base">
                  <Home />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize font-semibold text-base">
                {activeCategoryName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
