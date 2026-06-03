import { GlassCard } from "@/components/common/GlassCard";
import { Skeleton } from "@/components/common/Skeleton";

export function AQIBadgeSkeleton() {
  return (
    <GlassCard className="flex items-center gap-4 p-4">
      <Skeleton className="size-14 rounded-2xl" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </GlassCard>
  );
}
