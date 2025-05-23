import Link from "next/link";
import { PackageSearch, RefreshCw, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NoProductsFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 py-12">
      <Card className="w-full max-w-md border-dashed">
        <CardContent className="pt-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
            <PackageSearch className="h-8 w-8 text-muted-foreground" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight mb-2">
            No Products Found
          </h2>
          <p className="text-muted-foreground mb-6">
            We couldn&apos;t find any products matching your criteria. Try
            adjusting your filters or search terms.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button variant="outline" className="flex-1" size="lg">
              <RefreshCw className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
            <Button className="flex-1" size="lg" asChild>
              <Link href="/">
                <ShoppingBag className="mr-2 h-4 w-4" />
                All Products
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-12">
        <h3 className="text-lg font-medium mb-4 text-center">
          You might be interested in
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Link
              key={i}
              href="#"
              className="flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center mb-2 group-hover:bg-muted/80 transition-colors">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium">Popular Category {i}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
