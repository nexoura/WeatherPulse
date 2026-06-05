import { GlassCard } from "@/components/common/GlassCard";
import { WeatherIcon } from "./WeatherIcon";
import { formatDayShort, formatTempShort } from "@/utils/format";
import type { DailyAggregate } from "@/types/weather";
import { Droplets } from "lucide-react";
import { motion } from "framer-motion";

export function DailyList({ days, tz }: { days: DailyAggregate[]; tz: number }) {
  const globalMin = Math.min(...days.map((d) => d.tempMin));
  const globalMax = Math.max(...days.map((d) => d.tempMax));
  const range = Math.max(1, globalMax - globalMin);

  return (
    <GlassCard strong className="overflow-hidden">
      <div className="border-b border-glass-border px-5 py-4">
        <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground">
          Daily forecast
        </h2>
      </div>
      <ul>
        {days.map((d, i) => {
          const left = ((d.tempMin - globalMin) / range) * 100;
          const width = ((d.tempMax - d.tempMin) / range) * 100;
          const pop = Math.round(d.popMax * 100);
          const isToday = i === 0;

          return (
            <motion.li
              key={d.date}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className="group flex items-center gap-4 border-b border-glass-border/60 px-5 py-3.5 last:border-0 hover:bg-foreground/3 transition-colors duration-150"
            >
              {/* Day label */}
              <div className="w-12 shrink-0">
                <span
                  className="text-sm font-bold"
                  style={{ color: isToday ? "var(--primary)" : "var(--foreground)" }}
                >
                  {isToday ? "Today" : formatDayShort(d.dt, tz)}
                </span>
              </div>

              {/* Icon */}
              <div className="shrink-0">
                <WeatherIcon icon={d.weather.icon} size={38} alt={d.weather.description} />
              </div>

              {/* Rain */}
              <div className="w-12 shrink-0">
                {pop > 0 ? (
                  <span className="flex items-center gap-0.5 text-xs font-semibold text-blue-500">
                    <Droplets className="size-3" />
                    {pop}%
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground/40">—</span>
                )}
              </div>

              {/* Min temp */}
              <span className="w-10 shrink-0 text-right text-sm font-medium text-muted-foreground">
                {formatTempShort(d.tempMin)}
              </span>

              {/* Temp range bar */}
              <div className="relative flex-1 h-2 rounded-full bg-foreground/8 hidden sm:block">
                <div
                  className="absolute h-2 rounded-full"
                  style={{
                    left: `${left}%`,
                    width: `${Math.max(10, width)}%`,
                    background: "linear-gradient(to right, #22d3ee, #6366f1)",
                  }}
                />
              </div>

              {/* Spacer on mobile to push temps to the right */}
              <div className="flex-grow sm:hidden" />

              {/* Max temp */}
              <span className="w-10 shrink-0 text-right text-sm font-bold">
                {formatTempShort(d.tempMax)}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </GlassCard>
  );
}
