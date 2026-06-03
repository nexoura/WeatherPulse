import { motion } from "framer-motion";
import { GlassCard } from "@/components/common/GlassCard";
import { WeatherIcon } from "./WeatherIcon";
import { formatHour, formatTempShort } from "@/utils/format";
import type { ForecastItem } from "@/types/weather";
import { Droplets } from "lucide-react";

export function HourlyStrip({ items, tz }: { items: ForecastItem[]; tz: number }) {
  const hours = items.slice(0, 10);
  const maxTemp = Math.max(...hours.map((h) => h.main.temp));
  const minTemp = Math.min(...hours.map((h) => h.main.temp));

  return (
    <GlassCard strong className="relative overflow-hidden p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground">
          Next 24 hours
        </h2>
      </div>

      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {hours.map((it, i) => {
          const isHottest = it.main.temp === maxTemp;
          const isCoolest = it.main.temp === minTemp;
          const pop = Math.round((it.pop ?? 0) * 100);

          return (
            <motion.div
              key={it.dt}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="group relative flex min-w-[90px] flex-col items-center gap-1.5 rounded-2xl px-3 py-3.5 transition-all duration-200 hover:scale-105"
              style={{
                background: isHottest
                  ? "linear-gradient(135deg, oklch(0.72 0.2 35 / 0.25), oklch(0.65 0.22 18 / 0.15))"
                  : isCoolest
                    ? "linear-gradient(135deg, oklch(0.74 0.14 207 / 0.25), oklch(0.55 0.21 264 / 0.15))"
                    : "var(--glass)",
                border: isHottest
                  ? "1px solid oklch(0.72 0.2 35 / 0.3)"
                  : isCoolest
                    ? "1px solid oklch(0.74 0.14 207 / 0.3)"
                    : "1px solid var(--glass-border)",
              }}
            >
              {/* Hour label */}
              <span className="text-[11px] font-semibold text-muted-foreground">
                {formatHour(it.dt, tz)}
              </span>

              {/* Weather icon */}
              <WeatherIcon icon={it.weather[0].icon} size={48} />

              {/* Temp */}
              <span
                className="text-base font-bold"
                style={{
                  color: isHottest
                    ? "oklch(0.72 0.2 35)"
                    : isCoolest
                      ? "oklch(0.55 0.21 264)"
                      : "var(--foreground)",
                }}
              >
                {formatTempShort(it.main.temp)}
              </span>

              {/* Rain probability */}
              {pop > 0 ? (
                <span className="flex items-center gap-0.5 text-[10px] font-semibold text-blue-500">
                  <Droplets className="size-2.5" />
                  {pop}%
                </span>
              ) : (
                <span className="text-[10px] text-muted-foreground/50">—</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}
