import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/redux/store";
import { airQuery, currentQuery, forecastQuery } from "@/services/queries";
import { HeroWeatherCard } from "@/components/weather/HeroWeatherCard";
import { HeroWeatherSkeleton } from "@/components/weather/HeroWeatherSkeleton";
import { HourlyStrip } from "@/components/weather/HourlyStrip";
import { HourlyStripSkeleton } from "@/components/weather/HourlyStripSkeleton";
import { DailyList } from "@/components/weather/DailyList";
import { DailyListSkeleton } from "@/components/weather/DailyListSkeleton";
import { TempTrendChart } from "@/components/charts/WeatherCharts";
import { ChartSkeleton } from "@/components/charts/ChartSkeleton";
import { Skeleton } from "@/components/common/Skeleton";
import { aggregateDaily, deriveAdvisories } from "@/utils/format";
import { GlassCard } from "@/components/common/GlassCard";
import { AdBanner } from "@/components/ads/AdComponents";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Today — WeatherPulse" },
      {
        name: "description",
        content:
          "Real-time temperature, humidity, wind, visibility, pressure, sunrise & sunset for your city.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const active = useAppSelector((s) => s.location.active);
  const units = useAppSelector((s) => s.weather.units);

  const current = useQuery(currentQuery(active.lat, active.lon, units));
  const forecast = useQuery(forecastQuery(active.lat, active.lon, units));
  const air = useQuery(airQuery(active.lat, active.lon));

  const tz = forecast.data?.city.timezone ?? current.data?.timezone ?? 0;
  const days = forecast.data ? aggregateDaily(forecast.data.list, tz) : [];
  const advisories = forecast.data ? deriveAdvisories(forecast.data.list, units) : [];

  useEffect(() => {
    if (current.data) {
      const tempVal = Math.round(current.data.main.temp);
      const unitSym = units === "metric" ? "°C" : "°F";
      document.title = `${current.data.name} Weather: ${tempVal}${unitSym} — WeatherPulse`;
    } else {
      document.title = `Today's Weather — WeatherPulse`;
    }
  }, [active.name, current.data, units]);

  const schemaData = current.data
    ? {
        "@context": "https://schema.org",
        "@type": "Place",
        name: current.data.name,
        geo: {
          "@type": "GeoCoordinates",
          latitude: active.lat,
          longitude: active.lon,
        },
        subjectOf: {
          "@type": "WebPage",
          name: `Weather Forecast for ${current.data.name}`,
          description: `Real-time temperature, humidity, wind, and conditions for ${current.data.name}.`,
        },
      }
    : null;

  return (
    <>
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      )}
      <div className="space-y-6">
        {current.isLoading || !current.data ? (
          <HeroWeatherSkeleton />
        ) : current.error ? (
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold">Couldn't load weather</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {(current.error as Error).message}. Check the server environment configuration
              (OPENWEATHER_API_KEY) or try another city.
            </p>
          </GlassCard>
        ) : (
          <HeroWeatherCard
            data={current.data}
            units={units}
            airQuality={air.data}
            advisories={advisories}
          />
        )}

        {forecast.isLoading || !forecast.data ? (
          <>
            <HourlyStripSkeleton />
            <ChartSkeleton />
          </>
        ) : forecast.error ? (
          <GlassCard className="p-6">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="mt-2 h-3 w-64" />
          </GlassCard>
        ) : (
          <>
            <HourlyStrip items={forecast.data.list} tz={tz} />
            <AdBanner slot="home-inline-banner" />
            <TempTrendChart items={forecast.data.list} tz={tz} units={units} />
          </>
        )}

        {forecast.isLoading || !forecast.data ? (
          <DailyListSkeleton />
        ) : days.length > 0 ? (
          <DailyList days={days} tz={tz} />
        ) : null}
      </div>
    </>
  );
}
