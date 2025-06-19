"use client";
import { HeaderTitle } from "@/components/common/header-title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Edit, Package, Tag, User } from "lucide-react";
import Image from "next/image";

const VendorProductPage = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getManyBySeller.queryOptions()
  );
  return (
    <div>
      <HeaderTitle
        title="Your Products"
        description="All of your product will shown here"
        linkText="Create Product"
        linkHref="/vendor/products/new"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        {data.map((product) => (
          <Card
            className="max-w-md mx-auto overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            key={product.id}
          >
            <div className="relative">
              <Image
                src={product.images[0].url || "/placeholder.svg"}
                alt={product.title}
                width={400}
                height={300}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 right-4">
                {(product.stock as number) - product.sale === 0 ? (
                  <Badge variant="destructive">Out of Stock</Badge>
                ) : (product.stock as number) - product.sale < 10 ? (
                  <Badge
                    variant="secondary"
                    className="bg-orange-100 text-orange-800"
                  >
                    Low Stock
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    In Stock
                  </Badge>
                )}
              </div>
            </div>

            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    Category Name
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    Tag name
                  </Badge>
                </div>
                <h2 className="text-xl font-bold line-clamp-2">
                  {product.title}
                </h2>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    by Mehedi
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-green-600">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-2xl text-muted-foreground line-through">
                      {formatPrice(product.basePrice)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Sale:{" "}
                      <span className="font-semibold">{product.sale}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      In Stoke:{" "}
                      <span className="font-semibold">
                        {(product.stock as number) - product.sale}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button className="w-full" variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Product
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VendorProductPage;
