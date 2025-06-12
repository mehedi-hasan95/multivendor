import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 bg-card" />
          <Skeleton className="h-4 w-80 bg-card" />
        </div>
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-card border-gray-700">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20 bg-card" />
                  <Skeleton className="h-4 w-4 bg-card rounded" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 bg-card mb-2" />
                {i === 3 && (
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-24 bg-card" />
                    <Skeleton className="h-3 w-20 bg-card" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders Section */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <Skeleton className="h-6 w-32 bg-card mb-2" />
              <Skeleton className="h-4 w-64 bg-card" />
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton className="h-10 flex-1 bg-card" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-20 bg-card" />
                <Skeleton className="h-10 w-24 bg-card" />
                <Skeleton className="h-10 w-24 bg-card" />
              </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-6 gap-4 py-3 border-b border-gray-800">
              <Skeleton className="h-4 w-16 bg-card" />
              <Skeleton className="h-4 w-20 bg-card" />
              <Skeleton className="h-4 w-16 bg-card" />
              <Skeleton className="h-4 w-12 bg-card" />
              <Skeleton className="h-4 w-18 bg-card" />
              <Skeleton className="h-4 w-16 bg-card" />
            </div>

            {/* Table Rows */}
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-6 gap-4 py-3 border-b border-gray-800/50"
              >
                <Skeleton className="h-4 w-20 bg-card" />
                <Skeleton className="h-4 w-24 bg-card" />
                <Skeleton className="h-4 w-18 bg-card" />
                <Skeleton className="h-4 w-32 bg-card" />
                <Skeleton className="h-4 w-16 bg-card" />
                <Skeleton className="h-4 w-12 bg-card" />
              </div>
            ))}
          </div>

          {/* Account Summary Section */}
          <div className="space-y-6">
            <div>
              <Skeleton className="h-6 w-36 bg-card mb-2" />
              <Skeleton className="h-4 w-48 bg-card" />
            </div>

            <Card className="bg-card border-gray-700">
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-28 bg-card" />
                  <Skeleton className="h-4 w-24 bg-card" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24 bg-card" />
                  <Skeleton className="h-4 w-16 bg-card" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-32 bg-card" />
                    <Skeleton className="h-4 w-8 bg-card" />
                  </div>
                  <Skeleton className="h-2 w-full bg-card" />
                  <Skeleton className="h-3 w-48 bg-card" />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div>
              <Skeleton className="h-5 w-28 bg-card mb-4" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full bg-card" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
