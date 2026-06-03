import { GlassCard } from "@/components/common/GlassCard";
import { Skeleton } from "@/components/common/Skeleton";

function DayRowSkeleton() {
  return (
    <li className="grid grid-cols-12 items-center gap-2 py-2">
      <Skeleton className="col-span-2 h-4 w-10" />
      <Skeleton className="col-span-1 mx-auto size-8 rounded-full" />
      <Skeleton className="col-span-2 h-3 w-8" />
      <Skeleton className="col-span-1 ml-auto h-4 w-8" />
      <div className="col-span-5">
        <Skeleton className="h-1.5 w-full rounded-full" />
      </div>
      <Skeleton className="col-span-1 ml-auto h-4 w-8" />
    </li>
  );
}

export function DailyListSkeleton() {
  return (
    <GlassCard className="p-4">
      <Skeleton className="mb-2 h-4 w-28" />
      <ul className="divide-y divide-glass-border">
        {[...Array(5)].map((_, i) => (
          <DayRowSkeleton key={i} />
        ))}
      </ul>
    </GlassCard>
  );
}
