import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SingleProduct } from "./_components/single-product";
import { SingleNav } from "./_components/singleNav";

interface Props {
  params: Promise<{ id: string }>;
}
const ProductId = async ({ params }: Props) => {
  const { id } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getOne.queryOptions({
      id,
    })
  );
  void queryClient.prefetchQuery(trpc.cart.getCart.queryOptions());
  void queryClient.prefetchQuery(trpc.wishlist.getWishlist.queryOptions());
  void queryClient.prefetchQuery(
    trpc.reviews.getAvgReview.queryOptions({ id })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SingleNav />
      <SingleProduct id={id} />
    </HydrationBoundary>
  );
};

export default ProductId;
