import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatPrice } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  Icon: LucideIcon;
  mainRevenue: number;
  percentage: number;
  isPrice?: boolean;
}
export const VendorOrderCard = ({
  title,
  Icon,
  mainRevenue,
  percentage,
  isPrice = false,
}: Props) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isPrice ? formatPrice(mainRevenue) : mainRevenue}
        </div>
        <p className="text-xs text-muted-foreground">
          {percentage === null ? (
            "No data for last month"
          ) : (
            <>
              <span
                className={cn(
                  percentage >= 0 ? "text-green-600" : "text-red-600"
                )}
              >
                {percentage >= 0 ? "+" : "-"}
                {percentage.toFixed(1)}%
              </span>{" "}
              from last month
            </>
          )}
        </p>
      </CardContent>
    </Card>
  );
};
