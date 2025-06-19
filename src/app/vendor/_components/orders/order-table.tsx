"use client";
import { DataTable } from "@/lib/data-table";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { differenceInCalendarDays } from "date-fns";
import { orderColumns } from "./order-columns";
import { formatDate } from "@/lib/utils";

export const OrderTable = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.vendor.orders.queryOptions());
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
  const today = new Date();

  const product = data.map((item) => {
    const createdAt = new Date(item.order.createdAt);
    const shipping = item.order.shipping;
    let daysLeft: number | null = null;

    if (shipping === "overnight") {
      daysLeft = 0;
    } else if (shipping === "express") {
      const diff = differenceInCalendarDays(today, createdAt);
      daysLeft = Math.max(0, 2 - diff);
    } else if (shipping === "standard") {
      const diff = differenceInCalendarDays(today, createdAt);
      daysLeft = Math.max(0, 6 - diff);
    }

    return {
      title: item.product.title,
      id: item.id,
      paymentId: item.order.paymentId,
      orderId: item.orderId,
      quantity: item.quantity,
      price: item.price,
      status: item.status,
      date: formatDate(item.order.createdAt),
      shipping,
      daysLeft,
    };
  });

  return (
    <div>
      <h2 className="text-lg md:text-2xl lg:text-3xl font-bold">Your Order</h2>
      <p className="text-muted-foreground">
        Click on the order columns to update status
      </p>
      <DataTable
        columns={orderColumns}
        data={product}
        searchKey={"title"}
        filterOptions={[statusFilterOptions, shippingFilterOptions]}
        showPagination={true}
      />
    </div>
  );
};
