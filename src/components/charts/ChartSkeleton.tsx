import { GlassCard } from "@/components/common/GlassCard";
import { Skeleton } from "@/components/common/Skeleton";

const barHeights = [45, 62, 38, 78, 55, 30, 68, 52, 42, 75, 58, 35, 65, 48, 70, 40];

export function ChartSkeleton() {
  return (
    <GlassCard className="p-4">
      <Skeleton className="mb-3 h-4 w-36" />
      <div className="h-56 space-y-2">
        <div
          className="flex items-end justify-between gap-1 px-2"
          style={{ height: "calc(100% - 24px)" }}
        >
          {barHeights.map((h, i) => (
            <div
              key={i}
              className="w-full rounded-t-sm bg-foreground/10"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <Skeleton className="h-4 w-full" />
      </div>
    </GlassCard>
  );
}
