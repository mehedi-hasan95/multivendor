import Link from "next/link";
import GradientText from "@/components/generated/gradient-text";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from "lucide-react";

interface HeaderTitleProps {
  title: string;
  description?: string;
  linkHref: string;
  linkText: string;
}
export const HeaderTitle = ({
  linkHref,
  linkText,
  title,
  description,
}: HeaderTitleProps) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <GradientText
            element="H1"
            className="text-xl md:text-2xl lg:text-3xl font-bold"
          >
            {title}
          </GradientText>
          <GradientText>{description}</GradientText>
        </div>
        <Link
          className="iconBackground px-4 py-2 font-semibold flex gap-2 items-center"
          href={linkHref}
        >
          <PlusCircle className="h-4 w-4" />
          {linkText}
        </Link>
      </div>
      <Separator className="my-3" />
    </>
  );
};
