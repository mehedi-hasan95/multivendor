"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import { useTRPC } from "@/trpc/client";
import { formatDate } from "@/lib/utils";
import { DataTable } from "@/lib/data-table";

interface Props {
  limit?: number;
  showPagination?: boolean;
}
export default function ProductTable({ limit, showPagination }: Props) {
  const trpc = useTRPC();
  const { data: lasestOrder } = useSuspenseQuery(
    trpc.cart.latestOrder.queryOptions({ limit: limit })
  );
  const statusFilterOptions = {
    columnId: "status",
    options: [
      { label: "Pending", value: "PENDING" },
      { label: "Processing", value: "PROCESSING" },
      { label: "Shipped", value: "SHIPPED" },
      { label: "Delivered", value: "DELIVERED" },
      { label: "Cancelled", value: "CANCELLED" },
      { label: "Cancelled", value: "REFUNDED" },
    ],
  };
  const shippingFilterOptions = {
    columnId: "shipping",
    options: [
      { label: "Standard", value: "standard" },
      { label: "Express", value: "express" },
      { label: "Overnight", value: "overnight" },
    ],
  };
  const data = lasestOrder?.map((item) => ({
    id: item.order.id.slice(0, 8) + "-***",
    amount: item.price,
    email: item.user.email,
    date: formatDate(item.order.createdAt),
    shipping: item.order.shipping,
    status: item.status,
  }));
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey={"id"}
      filterOptions={[statusFilterOptions, shippingFilterOptions]}
      showPagination={showPagination}
    />
  );
}
