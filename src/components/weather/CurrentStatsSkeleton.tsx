import { GlassCard } from "@/components/common/GlassCard";
import { Skeleton } from "@/components/common/Skeleton";

function StatSkeleton({ index }: { index: number }) {
  return (
    <GlassCard className="relative h-full overflow-hidden p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="size-9 rounded-xl" />
      </div>
      <Skeleton className="mt-3 h-7 w-20" />
      <Skeleton className="mt-1 h-3 w-24" />
    </GlassCard>
  );
}

export function CurrentStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {[...Array(6)].map((_, i) => (
        <StatSkeleton key={i} index={i} />
      ))}
    </div>
  );
}
