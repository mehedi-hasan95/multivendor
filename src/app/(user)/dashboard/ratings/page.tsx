import { getQueryClient, trpc } from "@/trpc/server";
import { ProductRatings } from "../_components/ratings/product-ratings";

const RatingsPages = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.cart.allOrders.queryOptions({ shipping: "DELIVERED" })
  );
  return (
    <div>
      <ProductRatings />
    </div>
  );
};

export default RatingsPages;
