import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

interface EmptyCartProps {
  title?: string;
  buttonText?: string;
  buttonLink?: string;
}
export const EmptyCart = ({
  title,
  buttonText,
  buttonLink,
}: EmptyCartProps) => {
  return (
    <div className="container mx-auto px-4 flex items-center justify-center flex-col min-h-screen">
      <div className="max-w-2xl mx-auto text-center ">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">
          Looks like you haven&apos;t{" "}
          {title ? title : "added anything to your cart yet"}.
        </p>
        <Button asChild size="lg">
          <Link href={buttonLink ? buttonLink : "/"}>
            {buttonText ? buttonText : "Continue Shopping"}
          </Link>
        </Button>
      </div>
    </div>
  );
};
