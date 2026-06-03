import { Skeleton } from "@/components/common/Skeleton";

export function ForecastHeaderSkeleton() {
  return (
    <header className="space-y-2">
      <Skeleton className="h-10 w-72" />
      <Skeleton className="h-5 w-96" />
    </header>
  );
}
