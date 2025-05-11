import { cn } from "@/lib/utils";
import Link from "next/link";

interface LogoProps {
  className?: string;
}
export const Logo = ({ className }: LogoProps) => {
  return (
    <Link href={"/"} className={cn("text-2xl font-black", className)}>
      Nestify
    </Link>
  );
};
