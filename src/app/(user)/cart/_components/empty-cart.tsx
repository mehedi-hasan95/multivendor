import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

interface EmptyCartProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}
export const EmptyCart = ({
  title = "Your cart is empty",
  buttonText = "Continue Shopping",
  buttonLink = "/",
  description = "cart",
}: EmptyCartProps) => {
  return (
    <div className="container mx-auto px-4 flex items-center justify-center flex-col min-h-screen">
      <div className="max-w-2xl mx-auto text-center ">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="text-muted-foreground mb-8">
          Looks like you haven&apos;t added anything to your {description} yet.
        </p>
        <Button asChild size="lg">
          <Link href={buttonLink}>{buttonText}</Link>
        </Button>
      </div>
    </div>
  );
};
