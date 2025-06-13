"use client";

import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/generated/prisma";
import { ColumnDef } from "@tanstack/react-table";

const statusColorMap = {
  PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  PROCESSING: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  SHIPPED: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  DELIVERED: "bg-green-500/20 text-green-400 border-green-500/30",
  CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
  REFUNDED: "bg-red-100 text-red-800 border-red-500/30",
};
export type Payment = {
  id: string;
  amount: number;
  status: OrderStatus;
  email: string;
  date: string;
  shipping: string | null;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: "Order Id",
  },
  {
    accessorKey: "date",
    header: "Purchase",
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as OrderStatus;
      return (
        <Badge className={statusColorMap[status]}>
          {status.charAt(0) + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "shipping",
    header: "Shipping",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
];
