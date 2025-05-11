import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { JSX } from "react";

interface SheetModifyProps {
  tigger?: JSX.Element;
  title?: string;
  children: React.ReactNode;
  className?: string;
  sheetPosition?: "left" | "top" | "right" | "bottom";
}
export const SheetModify = ({
  children,
  className,
  tigger,
  title,
  sheetPosition = "left",
}: SheetModifyProps) => {
  return (
    <div className={cn(className)}>
      <Sheet>
        <SheetTrigger>
          {tigger ? tigger : <Menu className="size-4 cursor-pointer" />}
        </SheetTrigger>
        <SheetContent side={sheetPosition}>
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription className={cn(title ? "" : "pt-5")}>
              {children}
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};
