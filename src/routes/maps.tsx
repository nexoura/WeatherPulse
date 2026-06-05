import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { useAppSelector } from "@/redux/store";
import { TILE_LAYERS, TileLayerId } from "@/config/constants";
import { GlassCard } from "@/components/common/GlassCard";
import { Skeleton } from "@/components/common/Skeleton";
import { cn } from "@/lib/utils";
import {
  Cloud,
  CloudRain,
  Gauge,
  Wind,
  Thermometer,
  MapPin,
  Layers,
  ChevronDown,
} from "lucide-react";

const WeatherMap = lazy(() =>
  import("@/components/maps/WeatherMap").then((m) => ({ default: m.WeatherMap })),
);

export const Route = createFileRoute("/maps")({
  head: () => ({
    meta: [
      { title: "Weather Maps — WeatherPulse" },
      {
        name: "description",
        content: "Interactive weather maps: rain, wind, temperature, clouds and pressure overlays.",
      },
    ],
  }),
  component: MapsPage,
});

type LayerMeta = {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accent: string;
  legend: {
    label: string;
    unit: string;
    description: string;
    stops: { c: string; v: string }[];
  };
};

const LAYER_META: Record<TileLayerId, LayerMeta> = {
  clouds_new: {
    icon: Cloud,
    accent: "#94a3b8",
    legend: {
      label: "Cloud cover",
      unit: "%",
      description: "Sky obscured by clouds",
      stops: [
        { c: "#0f172a", v: "0" },
        { c: "#64748b", v: "25" },
        { c: "#cbd5e1", v: "50" },
        { c: "#f1f5f9", v: "75" },
        { c: "#ffffff", v: "100" },
      ],
    },
  },
  precipitation_new: {
    icon: CloudRain,
    accent: "#38bdf8",
    legend: {
      label: "Precipitation",
      unit: "mm/h",
      description: "Rain, snow & sleet intensity",
      stops: [
        { c: "#0c4a6e", v: "0" },
        { c: "#0ea5e9", v: "0.5" },
        { c: "#22c55e", v: "2" },
        { c: "#facc15", v: "10" },
        { c: "#ef4444", v: "25" },
        { c: "#a21caf", v: "50+" },
      ],
    },
  },
  pressure_new: {
    icon: Gauge,
    accent: "#a78bfa",
    legend: {
      label: "Sea-level pressure",
      unit: "hPa",
      description: "Atmospheric pressure",
      stops: [
        { c: "#6d28d9", v: "950" },
        { c: "#0ea5e9", v: "990" },
        { c: "#22c55e", v: "1013" },
        { c: "#facc15", v: "1030" },
        { c: "#ef4444", v: "1050" },
      ],
    },
  },
  wind_new: {
    icon: Wind,
    accent: "#34d399",
    legend: {
      label: "Wind speed",
      unit: "m/s",
      description: "Surface wind",
      stops: [
        { c: "#064e3b", v: "0" },
        { c: "#10b981", v: "5" },
        { c: "#facc15", v: "15" },
        { c: "#f97316", v: "25" },
        { c: "#ef4444", v: "40+" },
      ],
    },
  },
  temp_new: {
    icon: Thermometer,
    accent: "#fb923c",
    legend: {
      label: "Temperature",
      unit: "°C",
      description: "Air temperature at 2 m",
      stops: [
        { c: "#1e3a8a", v: "-30" },
        { c: "#0ea5e9", v: "-10" },
        { c: "#22c55e", v: "10" },
        { c: "#facc15", v: "20" },
        { c: "#f97316", v: "30" },
        { c: "#ef4444", v: "40+" },
      ],
    },
  },
};

function MapSkeleton() {
  return (
    <div className="h-[380px] sm:h-[460px] md:h-[560px] w-full rounded-2xl relative overflow-hidden bg-glass-strong/45 animate-pulse border border-glass-border">
      {/* Zoom controls placeholder */}
      <div className="absolute left-4 top-4 space-y-2">
        <div className="h-8 w-8 rounded-lg bg-foreground/10 border border-glass-border" />
        <div className="h-8 w-8 rounded-lg bg-foreground/10 border border-glass-border" />
      </div>
      {/* Location radar ping placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-6 w-6">
          <div className="absolute inset-0 rounded-full bg-cyan-500/25 animate-ping" />
          <div className="absolute inset-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.7)]" />
        </div>
      </div>
      {/* Base map grid simulation */}
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-10 pointer-events-none">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="border border-dashed border-foreground/30" />
        ))}
      </div>
      {/* Layers controller placeholder */}
      <div className="absolute right-4 top-4 h-8 w-8 rounded-lg bg-foreground/10 border border-glass-border" />
    </div>
  );
}

function MapsPage() {
  const active = useAppSelector((s) => s.location.active);
  const [layer, setLayer] = useState<TileLayerId>("precipitation_new");
  const [mounted, setMounted] = useState(false);
  const [legendOpen, setLegendOpen] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.title = `Live Weather Overlay Maps for ${active.name} — WeatherPulse`;
  }, [active.name]);

  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const legendId = useId();
  const liveId = useId();

  const meta = LAYER_META[layer];
  const gradient = `linear-gradient(90deg, ${meta.legend.stops.map((s) => s.c).join(", ")})`;

  function focusTab(idx: number) {
    const len = TILE_LAYERS.length;
    const next = (idx + len) % len;
    const id = TILE_LAYERS[next].id;
    setLayer(id);
    tabsRef.current[next]?.focus();
  }

  function onTabKeyDown(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        focusTab(i + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        focusTab(i - 1);
        break;
      case "Home":
        e.preventDefault();
        focusTab(0);
        break;
      case "End":
        e.preventDefault();
        focusTab(TILE_LAYERS.length - 1);
        break;
    }
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <Layers className="h-3.5 w-3.5" aria-hidden="true" />
            Live overlays
          </div>
          <h1 className="text-4xl font-semibold tracking-tight">
            Weather <span className="text-gradient-cool">maps</span>
          </h1>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" style={{ color: meta.accent }} aria-hidden="true" />
            <span suppressHydrationWarning className="font-medium text-foreground">
              {mounted ? active.name : "Loading…"}
            </span>
            <span className="opacity-60">· Drag to pan · Scroll to zoom</span>
          </p>
        </div>
        <div
          role="tablist"
          aria-label="Weather overlay layer"
          aria-orientation="horizontal"
          className="no-scrollbar flex gap-1 overflow-x-auto rounded-full border border-glass-border bg-glass p-1 backdrop-blur-xl"
        >
          {TILE_LAYERS.map((l, i) => {
            const lm = LAYER_META[l.id];
            const Icon = lm.icon;
            const isActive = layer === l.id;
            return (
              <button
                key={l.id}
                ref={(el) => {
                  tabsRef.current[i] = el;
                }}
                role="tab"
                type="button"
                id={`layer-tab-${l.id}`}
                aria-selected={isActive}
                aria-controls={legendId}
                aria-label={`${l.label} layer — ${lm.legend.description}, measured in ${lm.legend.unit}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setLayer(l.id)}
                onKeyDown={(e) => onTabKeyDown(e, i)}
                className={cn(
                  "flex min-h-11 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium tracking-tight transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive
                    ? "bg-foreground text-background shadow-lg"
                    : "text-muted-foreground hover:bg-foreground/10 hover:text-foreground",
                )}
                style={isActive ? { boxShadow: `0 8px 24px -8px ${lm.accent}` } : undefined}
              >
                <Icon className="h-4 w-4" style={{ color: isActive ? lm.accent : undefined }} />
                {l.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* SR-only live region announces the active layer change */}
      <div id={liveId} role="status" aria-live="polite" className="sr-only">
        {meta.legend.label} overlay active. {meta.legend.description}, measured in{" "}
        {meta.legend.unit}.
      </div>

      <GlassCard className="relative overflow-hidden p-2">
        <Suspense fallback={<MapSkeleton />}>
          {mounted ? (
            <div role="region" aria-label={`Interactive ${meta.legend.label.toLowerCase()} map`}>
              <WeatherMap lat={active.lat} lon={active.lon} layer={layer} />
            </div>
          ) : (
            <MapSkeleton />
          )}
        </Suspense>

        {/* Active layer chip — top-left */}
        <div className="pointer-events-none absolute left-5 top-5 z-[400]">
          <div
            className="pointer-events-auto flex items-center gap-2 rounded-full border border-glass-border bg-background/80 px-3 py-1.5 text-xs font-medium shadow-lg backdrop-blur-xl"
            aria-hidden="true"
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: meta.accent, boxShadow: `0 0 8px ${meta.accent}` }}
            />
            <span>{meta.legend.label}</span>
            <span className="text-muted-foreground">· {meta.legend.unit}</span>
          </div>
        </div>

        {/* Legend — bottom (accessible disclosure) */}
        <div className="pointer-events-none absolute inset-x-5 bottom-5 z-[400] flex justify-center">
          <section
            id={legendId}
            role="region"
            aria-labelledby={`${legendId}-title`}
            className="pointer-events-auto w-full max-w-lg rounded-2xl border border-glass-border bg-background/85 p-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-2 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <h2
                  id={`${legendId}-title`}
                  className="text-sm font-semibold tracking-tight text-foreground"
                >
                  {meta.legend.label}
                </h2>
                <p className="text-[11px] text-muted-foreground">{meta.legend.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="rounded-md bg-foreground/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground"
                  aria-label={`Unit: ${meta.legend.unit}`}
                >
                  {meta.legend.unit}
                </span>
                <button
                  type="button"
                  onClick={() => setLegendOpen((o) => !o)}
                  aria-expanded={legendOpen}
                  aria-controls={`${legendId}-scale`}
                  aria-label={legendOpen ? "Collapse legend scale" : "Expand legend scale"}
                  className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors",
                    "hover:bg-foreground/10 hover:text-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  )}
                >
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      legendOpen ? "rotate-0" : "-rotate-90",
                    )}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>

            <div
              id={`${legendId}-scale`}
              hidden={!legendOpen}
              role="group"
              aria-label={`${meta.legend.label} scale in ${meta.legend.unit}`}
            >
              <div
                className="h-3 w-full rounded-full ring-1 ring-foreground/15 shadow-inner"
                style={{ background: gradient }}
                role="img"
                aria-label={`Gradient from ${meta.legend.stops[0].v} to ${meta.legend.stops[meta.legend.stops.length - 1].v} ${meta.legend.unit}`}
              />
              <ul className="mt-1.5 flex justify-between font-mono text-[10px] font-medium text-muted-foreground tabular-nums">
                {meta.legend.stops.map((s, i) => (
                  <li key={i} aria-label={`${s.v} ${meta.legend.unit}`}>
                    {s.v}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </GlassCard>

      {/* Map Reading & Radar Guide */}
      <GlassCard className="p-6 md:p-8 space-y-6">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            How to Read Weather Radar & Maps
          </h2>
          <p className="text-xs text-muted-foreground">
            A practical guide to interpreting live atmospheric overlay layers and pressure patterns.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-primary">
              Interpreting Overlay Layers
            </h3>
            <div className="space-y-4 text-xs text-muted-foreground">
              <div>
                <strong className="text-foreground text-sm font-medium block mb-1">
                  Precipitation Radar
                </strong>
                <p className="leading-relaxed">
                  Shows the intensity of liquid and frozen water in the air. Deep blue indicates
                  light rain or drizzle (less than 0.5 mm/h), green represents moderate rainfall
                  (around 2 mm/h), yellow to orange denotes heavy downpours (up to 10 mm/h), and
                  deep red or purple/violet signals severe storms (25+ mm/h) or localized flash
                  flooding risk.
                </p>
              </div>
              <div>
                <strong className="text-foreground text-sm font-medium block mb-1">
                  Temperature Mapping
                </strong>
                <p className="leading-relaxed">
                  Depicts air temperatures at a height of 2 meters. Blue/dark shades represent cold
                  zones below freezing (less than 0°C), greens represent temperate regions (10°C to
                  15°C), yellow to orange indicates warm sub-tropical conditions (20°C to 30°C), and
                  bright red signals extreme heat (40°C+).
                </p>
              </div>
              <div>
                <strong className="text-foreground text-sm font-medium block mb-1">
                  Wind & Clouds
                </strong>
                <p className="leading-relaxed">
                  Cloud layers outline percentage-based sky cover, showing cloud density in
                  grayscale. The wind speed map uses a green-to-red scale to highlight wind gust
                  velocities (measured in m/s), indicating calm breezes, gusty drafts, or dangerous
                  storm-level gales (40+ m/s).
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-primary">
              High vs. Low Pressure Systems
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Atmospheric pressure maps (measured in Hectopascals, or hPa) are key to forecasting
              regional weather changes. Identifying pressure centers helps predict upcoming weather
              patterns:
            </p>
            <div className="space-y-3 text-xs text-muted-foreground">
              <div className="p-3.5 rounded-xl bg-sky-500/5 border border-sky-500/15">
                <span className="font-semibold text-sky-400 block mb-1">
                  Low-Pressure Cells (Cyclonic Areas)
                </span>
                <p className="leading-relaxed">
                  Characterized by values below the standard 1013.25 hPa. Air rises in these
                  regions, cooling and condensing into clouds. Low pressure typically brings
                  overcast skies, wind, precipitation, and stormy or volatile weather conditions.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-orange-500/5 border border-orange-500/15">
                <span className="font-semibold text-orange-400 block mb-1">
                  High-Pressure Cells (Anticyclones)
                </span>
                <p className="leading-relaxed">
                  Indicated by readings above 1013.25 hPa. Sinking air prevents warm air from rising
                  and condensing. High pressure is associated with stable, calm weather, clear
                  skies, sunshine, and minimal wind activity.
                </p>
              </div>
            </div>
          </section>
        </div>
      </GlassCard>

      <p className="text-center text-xs text-muted-foreground">
        Map data © OpenStreetMap · Tiles © CARTO · Weather overlays © OpenWeather
      </p>
    </div>
  );
}
