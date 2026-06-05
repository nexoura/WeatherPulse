import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/redux/store";
import { forecastQuery } from "@/services/queries";
import {
  HumidityChart,
  RainProbabilityChart,
  TempTrendChart,
  WindChart,
} from "@/components/charts/WeatherCharts";
import { ChartSkeleton } from "@/components/charts/ChartSkeleton";
import { HourlyStrip } from "@/components/weather/HourlyStrip";
import { HourlyStripSkeleton } from "@/components/weather/HourlyStripSkeleton";
import { DailyList } from "@/components/weather/DailyList";
import { DailyListSkeleton } from "@/components/weather/DailyListSkeleton";
import { ForecastHeaderSkeleton } from "@/components/weather/ForecastHeaderSkeleton";
import { aggregateDaily } from "@/utils/format";
import { CalendarDays } from "lucide-react";
import { AdBanner } from "@/components/ads/AdComponents";
import { GlassCard } from "@/components/common/GlassCard";

export const Route = createFileRoute("/forecast")({
  head: () => ({
    meta: [
      { title: "Forecast — WeatherPulse" },
      {
        name: "description",
        content:
          "Hourly and multi-day forecast with temperature, humidity, rain probability and wind charts.",
      },
    ],
  }),
  component: ForecastPage,
});

function ForecastPage() {
  const active = useAppSelector((s) => s.location.active);
  const units = useAppSelector((s) => s.weather.units);
  const { data, isLoading } = useQuery(forecastQuery(active.lat, active.lon, units));
  const tz = data?.city.timezone ?? 0;

  useEffect(() => {
    if (data) {
      document.title = `Weather Forecast for ${data.city.name}, ${data.city.country} — WeatherPulse`;
    } else {
      document.title = `Weather Forecast — WeatherPulse`;
    }
  }, [data]);

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <ForecastHeaderSkeleton />
        <HourlyStripSkeleton />
        <div className="grid gap-4 md:grid-cols-2">
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
        <DailyListSkeleton />
      </div>
    );
  }

  const days = aggregateDaily(data.list, tz);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <CalendarDays className="size-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Weather Forecast
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            {data.city.name}
            <span className="ml-2 text-xl font-normal text-muted-foreground">
              {data.city.country}
            </span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Hourly outlook for the next 24 hours · {days.length}-day summary
          </p>
        </div>
        <div className="rounded-xl bg-foreground/6 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur-sm">
          {today}
        </div>
      </header>

      {/* ── Hourly Strip ── */}
      <HourlyStrip items={data.list} tz={tz} />

      {/* ── Charts grid ── */}
      <div>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          48-hour charts
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <TempTrendChart items={data.list} tz={tz} units={units} />
          <RainProbabilityChart items={data.list} tz={tz} />
          <HumidityChart items={data.list} tz={tz} />
          <WindChart items={data.list} tz={tz} units={units} />
        </div>
      </div>

      {/* Replace slot with real numeric Ad Unit ID from AdSense Dashboard > Ads > By ad unit */}
      <AdBanner slot="REPLACE_WITH_REAL_SLOT_ID" />

      {/* ── Daily list ── */}
      <DailyList days={days} tz={tz} />

      {/* Meteorological Guide */}
      <GlassCard className="p-6 md:p-8 space-y-6">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            How to Interpret Meteorological Charts & Forecasts
          </h2>
          <p className="text-xs text-muted-foreground">
            A guide to understanding temperature trends, humidity levels, wind vectors, and
            precipitation probability.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-primary">
              Temperature & Humidity Analytics
            </h3>
            <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
              <p>
                <strong>Diurnal Temperature Cycles:</strong> Under normal conditions, temperatures
                peak in the mid-afternoon (usually around 3:00 PM to 4:00 PM local time) as solar
                radiation accumulates, and reach their minimum shortly before sunrise when thermal
                radiation loss from the Earth's surface peaks.
              </p>
              <p>
                <strong>Humidity & Dew Point:</strong> Relative humidity measures water vapor
                percentage relative to saturation at the current temperature. A high relative
                humidity (above 70%) combined with high heat index restricts sweat evaporation,
                making it feel significantly hotter than the actual ambient reading.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-primary">
              Precipitation Probability & Wind Vectors
            </h3>
            <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
              <p>
                <strong>Precipitation Probability (PoP):</strong> Contrary to popular belief, a "40%
                probability of rain" does not mean there is a 40% chance of rain in the sky. It is
                mathematically defined as:
                <span className="block font-mono bg-foreground/5 p-2 rounded-lg my-1 text-center border border-glass-border">
                  PoP = C × A
                </span>
                Where <strong className="text-foreground">C</strong> is the confidence that
                precipitation will form somewhere in the forecast area, and{" "}
                <strong className="text-foreground">A</strong> is the percentage of the area
                expected to receive measurable precipitation.
              </p>
              <p>
                <strong>Wind Vector Analysis:</strong> Wind speeds represent the rate of air
                movement (measured in km/h or mph). Gusts denote rapid, sudden rises in wind speed
                lasting under 20 seconds. Direction indicators point to where the wind is blowing{" "}
                <em>from</em> (e.g., a "North Wind" blows from North to South).
              </p>
            </div>
          </section>
        </div>
      </GlassCard>
    </div>
  );
}
