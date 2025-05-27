"use client";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface Props {
  productId: string;
  categoryId: string;
  subCategoryId: string;
  title: string;
  productImage: string;
  sellerImage?: string;
  sellerName: string;
  price: number;
  serlerUserName: string;
}
export const ProductCard = ({
  categoryId,
  price,
  productId,
  productImage,
  sellerName,
  subCategoryId,
  title,
  sellerImage,
  serlerUserName,
}: Props) => {
  return (
    <div
      className="group relative overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md"
      key={productId}
    >
      <Link href={`/${categoryId}/${subCategoryId}/${productId}`}>
        <span className="sr-only">View {title}</span>

        <div className="relative aspect-square overflow-hidden">
          <Image
            src={productImage}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      </Link>
      <div className="p-4">
        <h3 className="font-medium text-lg line-clamp-1">{title}</h3>
        <Link
          href={`/${serlerUserName}`}
          className="capitalize font-medium flex gap-1 items-center underline py-3"
        >
          <Image
            src={sellerImage || "https://github.com/shadcn.png"}
            alt={sellerName}
            height={20}
            width={20}
            className="rounded-full"
          />
          <p>{sellerName}</p>
        </Link>
        <div className="flex items-center justify-between">
          <span className="font-semibold">{formatPrice(price)}</span>
          <button
            className="relative z-20 rounded-full bg-primary p-2 text-primary-foreground shadow-sm hover:bg-primary/90"
            aria-label={`Add ${title} to cart`}
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
  );
};
