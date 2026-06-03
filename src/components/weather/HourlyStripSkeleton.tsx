import { GlassCard } from "@/components/common/GlassCard";
import { Skeleton } from "@/components/common/Skeleton";

function HourCardSkeleton() {
  return (
    <div className="flex min-w-[88px] flex-col items-center rounded-2xl bg-foreground/5 px-3 py-3">
      <Skeleton className="h-3 w-10" />
      <Skeleton className="my-1 size-14 rounded-full" />
      <Skeleton className="h-5 w-10" />
      <Skeleton className="mt-0.5 h-3 w-6" />
    </div>
  );
}

export function HourlyStripSkeleton() {
  return (
    <GlassCard className="p-4">
      <div className="mb-2 flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="no-scrollbar -mx-2 flex gap-2 overflow-x-auto px-2 pb-1">
        {[...Array(8)].map((_, i) => (
          <HourCardSkeleton key={i} />
        ))}
      </div>
    </GlassCard>
  );
}
