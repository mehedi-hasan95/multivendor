"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { shippingMethod } from "@/constants/trpc.types";
import { OrderStatus } from "@/generated/prisma";
import { ColumnDef } from "@tanstack/react-table";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type Payment = {
  title: string;
  id: string;
  paymentId: string | null;
  orderId: string;
  quantity: number;
  price: number;
  status: OrderStatus;
  date: string;
  shipping: string | null;
  daysLeft: number | null;
};

const statusColorMap = {
  PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  PROCESSING: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  SHIPPED: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  DELIVERED: "bg-green-500/20 text-green-400 border-green-500/30",
  CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
  REFUNDED: "bg-red-100 text-red-800 border-red-500/30",
};

const shippingColorMap = {
  overnight: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  standard: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  experss: "bg-sky-500/20 text-sky-400 border-sky-500/30",
};

export const orderColumns: ColumnDef<Payment>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      const shortenedTitle =
        title.length > 40 ? `${title.slice(0, 40)}-***` : title;
      return (
        <Tooltip>
          <TooltipTrigger>{shortenedTitle}</TooltipTrigger>
          <TooltipContent>
            <p>{title}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "id",
    header: "Order Id",
    cell: ({ row }) => {
      const title = row.getValue("id") as string;
      const shortenedTitle =
        title.length > 8 ? `${title.slice(0, 8)}-***` : title;
      return (
        <Tooltip>
          <TooltipTrigger>{shortenedTitle}</TooltipTrigger>
          <TooltipContent>
            <p>{title}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "paymentId",
    header: "Payment Id",
  },
  {
    accessorKey: "date",
    header: "Purchase",
  },
  {
    accessorKey: "daysLeft",
    header: "Days Left",
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => {
      return <StatusDropdown row={row.original} />;
    },
  },
  {
    accessorKey: "shipping",
    header: "Shipping",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => {
      const status = row.getValue("shipping") as shippingMethod;
      return (
        <Badge className={shippingColorMap[status]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const ammount = parseFloat(row.getValue("price"));
      return <div className="font-medium">{formatPrice(ammount)}</div>;
    },
  },
];

// Separate component to handle hook usage
function StatusDropdown({ row }: { row: Payment }) {
  const trpc = useTRPC();
  const router = useRouter();

  const updateOrderStatus = useMutation(
    trpc.vendor.updateOrderStatus.mutationOptions({
      onSuccess: () => {
        router.refresh();
        toast.success("Order status updated");
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    })
  );

  const handleChange = (status: OrderStatus) => {
    updateOrderStatus.mutate({
      id: row.id,
      orderId: row.orderId,
      status,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`text-xs px-3 py-1 border ${statusColorMap[row.status]}`}
        >
          {row.status.charAt(0) + row.status.slice(1).toLowerCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {(Object.keys(OrderStatus) as OrderStatus[]).map((status) => (
          <DropdownMenuItem key={status} onClick={() => handleChange(status)}>
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
