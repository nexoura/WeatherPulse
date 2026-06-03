/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { GlassCard } from "@/components/common/GlassCard";
import { WeatherIcon } from "./WeatherIcon";
import { Link } from "@tanstack/react-router";
import { AQI_SCALE } from "@/config/constants";
import { formatTemp, formatTime, formatVisibility, formatWind } from "@/utils/format";
import type { CurrentWeather, Units, AirPollutionResponse } from "@/types/weather";
import {
  Sunrise,
  Sunset,
  MapPin,
  Plus,
  Check,
  Droplets,
  Eye,
  Gauge,
  Thermometer,
  Wind as WindIcon,
  CloudRain,
  AlertTriangle,
  Info,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/common/ShareButton";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { addFavorite, removeFavorite } from "@/redux/locationSlice";

function tempTone(tC: number) {
  if (tC >= 28)
    return { from: "oklch(0.72 0.2 35)", to: "oklch(0.6 0.22 18)", tag: "text-gradient-warm" };
  if (tC >= 18)
    return { from: "oklch(0.78 0.16 70)", to: "oklch(0.62 0.2 35)", tag: "text-gradient-warm" };
  if (tC >= 8)
    return { from: "oklch(0.74 0.14 207)", to: "oklch(0.55 0.21 264)", tag: "text-gradient-cool" };
  return { from: "oklch(0.85 0.1 220)", to: "oklch(0.55 0.18 280)", tag: "text-gradient-cool" };
}

export function HeroWeatherCard({
  data,
  units,
  airQuality,
  advisories,
}: {
  data: CurrentWeather;
  units: Units;
  airQuality?: AirPollutionResponse;
  advisories?: { level: "info" | "warning" | "danger"; title: string; detail: string }[];
}) {
  const w = data.weather[0];
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((s) => s.location.favorites);
  const id = `${data.coord.lat.toFixed(3)},${data.coord.lon.toFixed(3)}`;
  const isFav = favorites.some((f) => f.id === id);

  const tC = units === "metric" ? data.main.temp : ((data.main.temp - 32) * 5) / 9;
  const tone = tempTone(tC);
  const humLabel =
    data.main.humidity > 70 ? "Muggy" : data.main.humidity < 30 ? "Dry" : "Comfortable";
  const aqi = airQuality?.list?.[0]?.main?.aqi;
  const aqiScale = aqi ? AQI_SCALE[aqi] : null;

  const toggleFav = () => {
    if (isFav) dispatch(removeFavorite(id));
    else
      dispatch(
        addFavorite({
          name: data.name,
          lat: data.coord.lat,
          lon: data.coord.lon,
          country: data.sys.country,
        }),
      );
  };

  const dateLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <GlassCard strong className="relative isolate overflow-hidden p-6 sm:p-10 ring-glow">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-90"
          style={{
            background: `radial-gradient(120% 100% at 10% 0%, ${tone.from} 0%, transparent 55%), radial-gradient(100% 80% at 100% 100%, ${tone.to} 0%, transparent 60%)`,
          }}
        />
        <div className="pointer-events-none absolute -right-24 -top-24 -z-10 size-80 rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 -z-10 size-72 rounded-full bg-accent/20 blur-3xl" />

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/10 px-3 py-1 font-medium backdrop-blur">
                <MapPin className="size-3.5" />
                {data.name}
                {data.sys.country ? `, ${data.sys.country}` : ""}
              </span>
              <span className="text-muted-foreground">{dateLabel}</span>
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <h1
                className={`${tone.tag} text-[5.5rem] font-bold leading-none tracking-tighter sm:text-[7.5rem]`}
              >
                {Math.round(data.main.temp)}°
              </h1>
              <span className="text-2xl font-light text-muted-foreground">
                {units === "metric" ? "C" : "F"}
              </span>
            </div>

            <p className="mt-2 text-lg font-medium capitalize text-foreground/90">
              {w.description}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Feels like {formatTemp(data.main.feels_like, units)} · H{" "}
              {formatTemp(data.main.temp_max, units)} · L {formatTemp(data.main.temp_min, units)}
            </p>
          </div>

          {/* Center Column: Integrated Weather Stats */}
          <div className="flex-1 min-w-[280px] max-w-lg lg:mx-8 xl:mx-16 my-auto">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              {(
                [
                  {
                    label: "Humidity",
                    value: `${data.main.humidity}%`,
                    sub: humLabel,
                    icon: Droplets,
                    color: "text-sky-500",
                  },
                  {
                    label: "Wind",
                    value: formatWind(data.wind.speed, units),
                    sub: `${data.wind.deg}°`,
                    icon: WindIcon,
                    color: "text-emerald-500",
                  },
                  {
                    label: "Visibility",
                    value: formatVisibility(data.visibility),
                    sub: data.visibility >= 10000 ? "Clear" : "Reduced",
                    icon: Eye,
                    color: "text-pink-500",
                  },
                  {
                    label: "Pressure",
                    value: `${data.main.pressure} hPa`,
                    sub: "Sea level",
                    icon: Gauge,
                    color: "text-amber-500",
                  },
                  {
                    label: "Feels Like",
                    value: formatTemp(data.main.feels_like, units),
                    sub:
                      data.main.feels_like > data.main.temp
                        ? "Warmer"
                        : data.main.feels_like < data.main.temp
                          ? "Cooler"
                          : "Matches",
                    icon: Thermometer,
                    color: "text-rose-500",
                  },
                  {
                    label: "Clouds",
                    value: `${data.clouds.all}%`,
                    sub: data.clouds.all > 60 ? "Overcast" : "Partly clear",
                    icon: CloudRain,
                    color: "text-blue-500",
                  },
                  ...(aqiScale
                    ? [
                        {
                          label: "Air Quality",
                          value: `${aqi} - ${aqiScale.label}`,
                          sub: aqiScale.tone,
                          icon: Activity,
                          color: "",
                          style: { color: aqiScale.color },
                          isLink: true,
                        },
                      ]
                    : []),
                ] as {
                  label: string;
                  value: string;
                  sub: string;
                  icon: any;
                  color?: string;
                  style?: React.CSSProperties;
                  isLink?: boolean;
                }[]
              ).map((s, idx) => {
                const Icon = s.icon;
                if (s.isLink) {
                  return (
                    <Link
                      key={idx}
                      to="/air-quality"
                      className="hover:opacity-85 transition-opacity block group"
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex items-center gap-1.5">
                          <Icon className="size-3.5" style={s.style} />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                            {s.label}
                          </span>
                        </div>
                        <span className="mt-1 text-lg font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                          {s.value}
                        </span>
                        <span className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors">
                          {s.sub}
                        </span>
                      </div>
                    </Link>
                  );
                }

                return (
                  <div key={idx} className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <Icon className={`size-3.5 ${s.color}`} />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {s.label}
                      </span>
                    </div>
                    <span className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                      {s.value}
                    </span>
                    <span className="text-xs text-muted-foreground">{s.sub}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                aria-label={isFav ? "Remove favorite" : "Save city"}
                onClick={toggleFav}
                className="bg-foreground/10 backdrop-blur hover:bg-foreground/20"
              >
                {isFav ? <Check className="size-4 text-accent" /> : <Plus className="size-4" />}
              </Button>
              <ShareButton
                title={`${data.name} weather`}
                text={`${formatTemp(data.main.temp, units)}, ${w.description}`}
                className="bg-foreground/10 backdrop-blur hover:bg-foreground/20"
              />
            </div>
            <div className="animate-floaty">
              <WeatherIcon icon={w.icon} size={160} alt={w.description} />
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-glass-border pt-4">
          <div className="flex items-start gap-6">
            {/* LEFT: Sunrise + Sunset stacked vertically */}
            <div className="flex flex-col gap-2.5">
              <div className="inline-flex items-center gap-2 text-sm">
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-aqi-fair/20 text-aqi-fair">
                  <Sunrise className="size-4" />
                </span>
                <span className="text-muted-foreground">Sunrise</span>
                <span className="font-semibold">{formatTime(data.sys.sunrise, data.timezone)}</span>
              </div>
              <div className="inline-flex items-center gap-2 text-sm">
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-aqi-poor/20 text-aqi-poor">
                  <Sunset className="size-4" />
                </span>
                <span className="text-muted-foreground">Sunset</span>
                <span className="font-semibold">{formatTime(data.sys.sunset, data.timezone)}</span>
              </div>
            </div>

            {/* Divider */}
            {advisories && advisories.length > 0 && (
              <div className="self-stretch w-px bg-glass-border shrink-0" />
            )}

            {/* RIGHT: Advisory boxes stacked vertically — pushed to far right */}
            {advisories && advisories.length > 0 && (
              <div className="flex flex-col gap-2 ml-auto">
                {advisories.map((a, i) => {
                  const isDanger = a.level === "danger";
                  const borderColor = isDanger ? "var(--destructive)" : "#f59e0b";
                  const bgColor = isDanger ? "rgba(239,68,68,0.08)" : "rgba(245,158,11,0.08)";
                  const textColor = isDanger ? "var(--destructive)" : "#d97706";
                  return (
                    <div
                      key={i}
                      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                      style={{ background: bgColor, border: `1.5px solid ${borderColor}50` }}
                    >
                      <AlertTriangle
                        className="size-4 shrink-0 animate-pulse"
                        style={{ color: textColor }}
                      />
                      <span className="font-semibold" style={{ color: textColor }}>
                        {a.title}
                      </span>
                      <span className="text-muted-foreground text-xs">{a.detail}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
