import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/redux/store";
import { airForecastQuery, airQuery } from "@/services/queries";
import { GlassCard } from "@/components/common/GlassCard";
import { AQI_SCALE } from "@/config/constants";
import { Skeleton } from "@/components/common/Skeleton";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AdBanner } from "@/components/ads/AdComponents";

export const Route = createFileRoute("/air-quality")({
  head: () => ({
    meta: [
      { title: "Air Quality — WeatherPulse" },
      {
        name: "description",
        content:
          "AQI, PM2.5, PM10, CO, NO₂, SO₂ and O₃ readings plus the next 24-hour air-quality outlook.",
      },
    ],
  }),
  component: AQIPage,
});

const POLLUTANTS = [
  { label: "PM2.5", key: "pm2_5" as const, unit: "μg/m³", color: "#f97316", safe: 12 },
  { label: "PM10", key: "pm10" as const, unit: "μg/m³", color: "#eab308", safe: 54 },
  { label: "CO", key: "co" as const, unit: "μg/m³", color: "#06b6d4", safe: 4400 },
  { label: "NO₂", key: "no2" as const, unit: "μg/m³", color: "#8b5cf6", safe: 100 },
  { label: "SO₂", key: "so2" as const, unit: "μg/m³", color: "#10b981", safe: 80 },
  { label: "O₃", key: "o3" as const, unit: "μg/m³", color: "#3b82f6", safe: 100 },
];

/** Compact pollutant mini-card for use inside the hero card */
function MiniPollutant({
  label,
  value,
  unit,
  color,
  safe,
  index,
}: {
  label: string;
  value: number;
  unit: string;
  color: string;
  safe: number;
  index: number;
}) {
  const pct = Math.min((value / safe) * 100, 100);
  const isHigh = value > safe * 0.75;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.3, ease: "easeOut" }}
      className="relative overflow-hidden rounded-xl bg-white/8 backdrop-blur-sm border border-white/12 p-3"
    >
      {/* Colored left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ background: color }}
      />

      {/* label */}
      <div className="flex items-center gap-1.5 mb-2 pl-1">
        <span className="size-2 rounded-full shrink-0" style={{ background: color }} />
        <span className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color }}>
          {label}
        </span>
      </div>

      {/* value */}
      <div className="text-xl font-black tracking-tight text-foreground leading-none pl-1">
        {value.toFixed(1)}
        <span className="ml-1 text-[10px] font-medium text-muted-foreground align-baseline">
          {unit}
        </span>
      </div>

      {/* progress bar */}
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-foreground/8">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: 0.12 + 0.05 * index, duration: 0.55, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: color, opacity: isHigh ? 1 : 0.65 }}
        />
      </div>
      <div
        className="mt-1 text-[9px] font-semibold"
        style={{ color: isHigh ? color : "var(--muted-foreground)" }}
      >
        {isHigh ? "⚠ Elevated" : "✓ Normal"}
      </div>
    </motion.div>
  );
}

function AQIPage() {
  const active = useAppSelector((s) => s.location.active);
  const now = useQuery(airQuery(active.lat, active.lon));
  const future = useQuery(airForecastQuery(active.lat, active.lon));

  useEffect(() => {
    document.title = `Air Quality Index in ${active.name} — WeatherPulse`;
  }, [active.name]);

  if (now.isLoading || !now.data?.list?.[0]) {
    return <Skeleton className="h-96 w-full" />;
  }

  const sample = now.data.list[0];
  const aqi = sample.main.aqi;
  const scale = AQI_SCALE[aqi];
  const c = sample.components;

  const forecastSeries =
    future.data?.list?.slice(0, 24).map((it) => ({
      t: new Date(it.dt * 1000).toLocaleTimeString(undefined, { hour: "numeric" }),
      aqi: it.main.aqi,
      pm25: +it.components.pm2_5.toFixed(1),
    })) ?? [];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Air quality in {active.name}</h1>
        <p className="text-sm text-muted-foreground">
          Indices and pollutant breakdown sourced from OpenWeatherMap.
        </p>
      </header>

      {/* ── Hero AQI card — 3-column: [AQI info] | [pollutant grid] | [scale] ── */}
      <GlassCard strong className="relative overflow-hidden">
        {/* ambient glow */}
        <div
          className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full blur-3xl"
          style={{ background: scale.color, opacity: 0.22 }}
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-20 size-64 rounded-full blur-3xl opacity-10"
          style={{ background: scale.color }}
        />

        <div className="relative flex flex-col gap-0 divide-y divide-glass-border lg:flex-row lg:items-stretch lg:divide-y-0 lg:divide-x lg:divide-glass-border">
          {/* ── LEFT: AQI badge + info ── */}
          <div className="flex shrink-0 flex-col justify-center p-6 sm:p-8 lg:w-72">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-3">
              Current AQI
            </div>
            {/* Large AQI number */}
            <div className="flex items-end gap-3">
              <span className="text-7xl font-black leading-none" style={{ color: scale.color }}>
                {aqi}
              </span>
              <div className="mb-1">
                <div
                  className="rounded-md px-2 py-0.5 text-xs font-bold uppercase"
                  style={{
                    background: `color-mix(in srgb, ${scale.color} 18%, transparent)`,
                    color: scale.color,
                  }}
                >
                  {scale.label}
                </div>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{scale.tone}</p>
          </div>

          {/* ── CENTER: 2×3 pollutant grid ── */}
          <div className="flex-1 p-6 sm:p-8">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Pollutant Breakdown
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {POLLUTANTS.map((p, i) => (
                <MiniPollutant
                  key={p.label}
                  label={p.label}
                  value={c[p.key]}
                  unit={p.unit}
                  color={p.color}
                  safe={p.safe}
                  index={i}
                />
              ))}
            </div>
          </div>

          {/* ── RIGHT: AQI scale legend ── */}
          <div className="flex shrink-0 flex-col justify-center gap-3 p-6 sm:p-8 lg:w-48">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              AQI Scale
            </span>
            <div className="flex flex-col gap-1.5">
              {([1, 2, 3, 4, 5] as const).map((n) => {
                const isActive = aqi === n;
                const isPast = aqi > n;
                return (
                  <div key={n} className="flex items-center gap-2.5">
                    {/* Dot indicator */}
                    <div
                      className="shrink-0 size-3 rounded-full transition-all duration-300"
                      style={{
                        background: AQI_SCALE[n].color,
                        opacity: isActive || isPast ? 1 : 0.25,
                        boxShadow: isActive ? `0 0 8px 2px ${AQI_SCALE[n].color}` : "none",
                        transform: isActive ? "scale(1.3)" : "scale(1)",
                      }}
                    />
                    <span
                      className="text-xs font-semibold"
                      style={{
                        color: isActive ? AQI_SCALE[n].color : "var(--muted-foreground)",
                        opacity: isActive || isPast ? 1 : 0.4,
                        fontWeight: isActive ? 700 : 500,
                      }}
                    >
                      {AQI_SCALE[n].label}
                    </span>
                    {isActive && (
                      <span
                        className="ml-auto rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                        style={{
                          background: `color-mix(in srgb, ${AQI_SCALE[n].color} 20%, transparent)`,
                          color: AQI_SCALE[n].color,
                        }}
                      >
                        Now
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Replace slot with real numeric Ad Unit ID from AdSense Dashboard > Ads > By ad unit */}
      <AdBanner slot="REPLACE_WITH_REAL_SLOT_ID" />

      {/* ── PM2.5 forecast chart ── */}
      {forecastSeries.length > 0 && (
        <GlassCard className="p-4 sm:p-6">
          <h3 className="mb-4 text-sm font-semibold text-muted-foreground">
            Next 24 hours — PM2.5
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastSeries}>
                <defs>
                  <linearGradient id="pm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="t"
                  tick={{ fill: "currentColor", fontSize: 11, opacity: 0.6 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "currentColor", fontSize: 11, opacity: 0.6 }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="pm25"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  fill="url(#pm)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      )}

      {/* Educational AQI Guide */}
      <GlassCard className="p-6 md:p-8 space-y-6">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Understanding Air Quality & Health
          </h2>
          <p className="text-xs text-muted-foreground">
            What the index numbers mean, pollutant definitions, and how to protect yourself.
          </p>
        </header>

        {/* AQI Category Thresholds Table */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-primary">
            AQI Ranges & Recommended Health Actions
          </h3>
          <div className="overflow-x-auto rounded-xl border border-glass-border">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-glass-border bg-foreground/3 text-muted-foreground font-semibold">
                  <th className="p-3">Index</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Health Implications</th>
                  <th className="p-3">Recommended Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border">
                <tr>
                  <td className="p-3 font-semibold text-emerald-500">1</td>
                  <td className="p-3">
                    <span className="rounded px-1.5 py-0.5 font-bold uppercase text-[10px] bg-emerald-500/10 text-emerald-500">
                      Good
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    Air quality is satisfactory, and air pollution poses little or no risk.
                  </td>
                  <td className="p-3 text-muted-foreground">
                    Perfect for outdoor activities. No special precautions needed.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-yellow-500">2</td>
                  <td className="p-3">
                    <span className="rounded px-1.5 py-0.5 font-bold uppercase text-[10px] bg-yellow-500/10 text-yellow-500">
                      Fair
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    Acceptable air quality; however, there may be a moderate health concern for a
                    very small number of unusually sensitive individuals.
                  </td>
                  <td className="p-3 text-muted-foreground">
                    Sensitive groups should consider reducing prolonged or heavy outdoor exertion.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-orange-500">3</td>
                  <td className="p-3">
                    <span className="rounded px-1.5 py-0.5 font-bold uppercase text-[10px] bg-orange-500/10 text-orange-500">
                      Moderate
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    Members of sensitive groups may experience health effects. The general public is
                    less likely to be affected.
                  </td>
                  <td className="p-3 text-muted-foreground">
                    Sensitive individuals should wear masks outdoors, close windows, and run air
                    purifiers.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-red-500">4</td>
                  <td className="p-3">
                    <span className="rounded px-1.5 py-0.5 font-bold uppercase text-[10px] bg-red-500/10 text-red-500">
                      Poor
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    Everyone may begin to experience health effects; members of sensitive groups may
                    experience more serious health effects.
                  </td>
                  <td className="p-3 text-muted-foreground">
                    Avoid heavy outdoor exertion. Keep windows shut. Sensitive groups should remain
                    indoors.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-purple-500">5</td>
                  <td className="p-3">
                    <span className="rounded px-1.5 py-0.5 font-bold uppercase text-[10px] bg-purple-500/10 text-purple-500">
                      Very Poor
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    Health alert: everyone may experience more serious health effects. Highly
                    hazardous conditions.
                  </td>
                  <td className="p-3 text-muted-foreground">
                    Everyone should avoid outdoor activities. Remain indoors, use high-efficiency
                    air filters.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Pollutants Descriptions */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-primary">
            Key Atmospheric Pollutants
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-foreground/3 border border-glass-border space-y-1.5">
              <h4 className="font-semibold text-sm text-foreground">
                PM2.5 (Fine Particulate Matter)
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tiny particles less than 2.5 micrometers in diameter that can penetrate deep into
                the lungs and enter the bloodstream. Primarily originates from vehicle exhausts,
                industrial combustion, and wood burning.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-foreground/3 border border-glass-border space-y-1.5">
              <h4 className="font-semibold text-sm text-foreground">
                PM10 (Coarse Particulate Matter)
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Particles between 2.5 and 10 micrometers in size, including dust, pollen, mold, and
                industrial emissions. They can irritate the airways and exacerbate respiratory
                conditions like asthma.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-foreground/3 border border-glass-border space-y-1.5">
              <h4 className="font-semibold text-sm text-foreground">CO (Carbon Monoxide)</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A colorless, odorless toxic gas produced by incomplete combustion of fossil fuels
                (mostly motor vehicles). Reduces the oxygen-carrying capacity of the blood.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-foreground/3 border border-glass-border space-y-1.5">
              <h4 className="font-semibold text-sm text-foreground">NO₂ (Nitrogen Dioxide)</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A highly reactive gas formed from emissions from power plants and vehicles. It
                contributes to smog formation, acid rain, and irritates human lung linings.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-foreground/3 border border-glass-border space-y-1.5">
              <h4 className="font-semibold text-sm text-foreground">SO₂ (Sulfur Dioxide)</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Emitted by power plants and smelting operations. It damages trees and plants,
                combines with water to form acid rain, and is harmful to individuals with asthma.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-foreground/3 border border-glass-border space-y-1.5">
              <h4 className="font-semibold text-sm text-foreground">O₃ (Ground-level Ozone)</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Formed by chemical reactions between oxides of nitrogen (NOx) and volatile organic
                compounds (VOC) in the presence of sunlight. It is a key ingredient of urban smog
                and triggers chest pain and coughing.
              </p>
            </div>
          </div>
        </section>
      </GlassCard>
    </div>
  );
}
