import { productGetMany } from "@/constants/trpc.types";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  data: productGetMany;
}
export const ProductCard = ({ data }: Props) => {
  if (data.length < 1) return <p>No product in this category</p>;
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {data.map((product) => (
        <div
          className="group relative overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md"
          key={product.id}
        >
          <Link
            href={`/${product.categoryId}/${product.subCategoryId}/${product.id}`}
            className="absolute inset-0 z-10"
          >
            <span className="sr-only">View {product.title}</span>
          </Link>
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.images[0].url}
              alt={product.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
          <div className="p-4">
            <h3 className="font-medium text-lg line-clamp-1">
              {product.title}
            </h3>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-semibold">${product.price.toFixed(2)}</span>
              <button
                className="relative z-20 rounded-full bg-primary p-2 text-primary-foreground shadow-sm hover:bg-primary/90"
                aria-label={`Add ${product.title} to cart`}
                onClick={(e) => {
                  e.preventDefault();
                  // Add to cart logic here
                }}
              >
                <ShoppingCart className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
