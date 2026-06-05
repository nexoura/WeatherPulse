import { GlassCard } from "@/components/common/GlassCard";
import { Skeleton } from "@/components/common/Skeleton";

export function HeroWeatherSkeleton() {
  return (
    <GlassCard strong className="relative isolate overflow-hidden p-6 sm:p-10">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 via-transparent to-foreground/5" />
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-7 w-32 rounded-full" />
            <Skeleton className="h-5 w-28" />
          </div>

          <div className="mt-5 flex items-center gap-4">
            <div className="flex items-baseline gap-3">
              <Skeleton className="h-20 w-28 sm:h-28 sm:w-40" />
              <Skeleton className="h-8 w-8" />
            </div>
            <Skeleton className="size-16 rounded-full md:hidden shrink-0" />
          </div>

          <Skeleton className="mt-2 h-6 w-48" />
          <Skeleton className="mt-1 h-4 w-64" />
        </div>

        <div className="flex flex-col items-end gap-3 ml-auto md:ml-0">
          <div className="flex gap-2">
            <Skeleton className="size-10 rounded-lg" />
            <Skeleton className="size-10 rounded-lg" />
          </div>
          <Skeleton className="size-28 rounded-full sm:size-40 hidden md:block" />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-glass-border pt-5">
        <div className="inline-flex items-center gap-2">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="inline-flex items-center gap-2">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </GlassCard>
  );
}
