import { GlassCard } from "@/components/common/GlassCard";
import type { CurrentWeather, Units } from "@/types/weather";
import { formatVisibility, formatWind } from "@/utils/format";
import { Droplets, Eye, Gauge, Thermometer, Wind, CloudRain } from "lucide-react";
import { motion } from "framer-motion";

function Stat({
  icon,
  label,
  value,
  sub,
  tone,
  index,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  tone: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.35, ease: "easeOut" }}
    >
      <GlassCard className="relative h-full overflow-hidden p-4">
        <div
          aria-hidden
          className="absolute -right-6 -top-6 size-24 rounded-full opacity-30 blur-2xl"
          style={{ background: tone }}
        />
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </span>
          <span
            className="inline-flex size-9 items-center justify-center rounded-xl"
            style={{ background: `color-mix(in oklab, ${tone} 22%, transparent)`, color: tone }}
          >
            {icon}
          </span>
        </div>
        <div className="mt-3 text-2xl font-semibold tracking-tight">{value}</div>
        {sub && <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>}
      </GlassCard>
    </motion.div>
  );
}

export function CurrentStats({ data, units }: { data: CurrentWeather; units: Units }) {
  const humLabel =
    data.main.humidity > 70 ? "Muggy" : data.main.humidity < 30 ? "Dry" : "Comfortable";

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <Stat
        index={0}
        icon={<Droplets className="size-4" />}
        label="Humidity"
        value={`${data.main.humidity}%`}
        sub={humLabel}
        tone="oklch(0.74 0.14 207)"
      />
      <Stat
        index={1}
        icon={<Wind className="size-4" />}
        label="Wind"
        value={formatWind(data.wind.speed, units)}
        sub={`${data.wind.deg}°`}
        tone="oklch(0.78 0.18 145)"
      />
      <Stat
        index={2}
        icon={<Eye className="size-4" />}
        label="Visibility"
        value={formatVisibility(data.visibility)}
        sub={data.visibility >= 10000 ? "Crystal clear" : "Reduced"}
        tone="oklch(0.65 0.2 330)"
      />
      <Stat
        index={3}
        icon={<Gauge className="size-4" />}
        label="Pressure"
        value={`${data.main.pressure}`}
        sub="hPa"
        tone="oklch(0.82 0.17 70)"
      />
      <Stat
        index={4}
        icon={<Thermometer className="size-4" />}
        label="Feels like"
        value={`${Math.round(data.main.feels_like)}°`}
        sub={
          data.main.feels_like > data.main.temp
            ? "Warmer"
            : data.main.feels_like < data.main.temp
              ? "Cooler"
              : "Matches air"
        }
        tone="oklch(0.7 0.2 35)"
      />
      <Stat
        index={5}
        icon={<CloudRain className="size-4" />}
        label="Clouds"
        value={`${data.clouds.all}%`}
        sub={data.clouds.all > 60 ? "Overcast" : "Partly clear"}
        tone="oklch(0.55 0.21 264)"
      />
    </div>
  );
}
