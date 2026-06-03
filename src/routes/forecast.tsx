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

      <AdBanner slot="forecast-inline-banner" />

      {/* ── Daily list ── */}
      <DailyList days={days} tz={tz} />
    </div>
  );
}
