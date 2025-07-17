"use client";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, generateTenentUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { StarRating } from "@/app/(user)/products/[id]/_components/star-rating";

interface Props {
  productId: string;
  title: string;
  productImage: string;
  sellerImage?: string;
  sellerName: string;
  price: number;
  selerUserName: string;
  avgRating: number;
  totalRatings: number;
}
export const ProductCard = ({
  price,
  productId,
  productImage,
  sellerName,
  title,
  sellerImage,
  selerUserName,
  avgRating,
  totalRatings,
}: Props) => {
  const router = useRouter();
  const tenantUrl = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(generateTenentUrl(selerUserName));
  };
  return (
    <div
      className="group relative overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md"
      key={productId}
    >
      {/* test  */}
      <Link href={`/products/${productId}`}>
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

        <div className="p-4">
          <h3 className="font-medium text-lg line-clamp-1">{title}</h3>
          <div
            onClick={tenantUrl}
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
          </div>
          <StarRating
            rating={avgRating}
            text={`${
              totalRatings > 0 ? avgRating.toFixed(1) + "/5" : ""
            } (${totalRatings})`}
          />
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
      </Link>
    </div>
  );
};
