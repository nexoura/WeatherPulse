import type { Units, ForecastItem, DailyAggregate } from "@/types/weather";

export const formatTemp = (t: number, units: Units = "metric") =>
  `${Math.round(t)}°${units === "metric" ? "C" : "F"}`;

export const formatTempShort = (t: number) => `${Math.round(t)}°`;

export const formatWind = (mps: number, units: Units = "metric") =>
  units === "metric" ? `${(mps * 3.6).toFixed(1)} km/h` : `${mps.toFixed(1)} mph`;

export const formatVisibility = (m: number) =>
  m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${m} m`;

export const formatTime = (unix: number, tzOffsetSec = 0) => {
  const d = new Date((unix + tzOffsetSec) * 1000);
  return d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
};

export const formatDayShort = (unix: number, tzOffsetSec = 0) => {
  const d = new Date((unix + tzOffsetSec) * 1000);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    timeZone: "UTC",
  });
};

export const formatHour = (unix: number, tzOffsetSec = 0) => {
  const d = new Date((unix + tzOffsetSec) * 1000);
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    timeZone: "UTC",
  });
};

export const aggregateDaily = (items: ForecastItem[], tzOffsetSec = 0): DailyAggregate[] => {
  const buckets = new Map<string, ForecastItem[]>();
  for (const it of items) {
    const d = new Date((it.dt + tzOffsetSec) * 1000);
    const key = d.toISOString().slice(0, 10);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(it);
  }
  const out: DailyAggregate[] = [];
  for (const [date, arr] of buckets) {
    const temps = arr.map((a) => a.main.temp);
    const noonish =
      arr.find((a) => a.dt_txt.endsWith("12:00:00")) ?? arr[Math.floor(arr.length / 2)];
    out.push({
      date,
      dt: arr[0].dt,
      tempMin: Math.min(...arr.map((a) => a.main.temp_min)),
      tempMax: Math.max(...arr.map((a) => a.main.temp_max)),
      humidityAvg: Math.round(arr.reduce((s, a) => s + a.main.humidity, 0) / arr.length),
      popMax: Math.max(...arr.map((a) => a.pop ?? 0)),
      weather: noonish.weather[0],
      wind: Math.max(...arr.map((a) => a.wind.speed)),
    });
    void temps;
  }
  return out.slice(0, 7);
};

export const deriveAdvisories = (
  items: ForecastItem[],
  units: Units,
): { level: "info" | "warning" | "danger"; title: string; detail: string }[] => {
  const next24 = items.slice(0, 8);
  const advisories: {
    level: "info" | "warning" | "danger";
    title: string;
    detail: string;
  }[] = [];
  const hotThreshold = units === "metric" ? 35 : 95;
  const heavyRain = next24.some((i) => (i.rain?.["3h"] ?? 0) > 10);
  const thunder = next24.some((i) => i.weather[0]?.main === "Thunderstorm");
  const hot = next24.some((i) => i.main.temp >= hotThreshold);

  if (thunder)
    advisories.push({
      level: "danger",
      title: "Thunderstorm advisory",
      detail: "Thunderstorms expected in the next 24 hours. Stay indoors when possible.",
    });
  if (heavyRain)
    advisories.push({
      level: "warning",
      title: "Heavy rain advisory",
      detail: "Significant rainfall expected. Allow extra travel time and avoid flood-prone areas.",
    });
  if (hot)
    advisories.push({
      level: "warning",
      title: "Heat advisory",
      detail: "Temperatures may reach extreme levels. Hydrate and limit outdoor activity.",
    });
  return advisories;
};
