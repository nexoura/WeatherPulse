import type { Units } from "@/types/weather";

export const DEFAULT_UNITS: Units = "metric";

export const DEFAULT_CITY = {
  name: "Ahmedabad",
  lat: 23.0225,
  lon: 72.5714,
  country: "IN",
};

export const QUERY_KEYS = {
  current: (lat: number, lon: number, units: Units) => ["current", lat, lon, units] as const,
  forecast: (lat: number, lon: number, units: Units) => ["forecast", lat, lon, units] as const,
  air: (lat: number, lon: number) => ["air", lat, lon] as const,
  airForecast: (lat: number, lon: number) => ["air-forecast", lat, lon] as const,
  geoSearch: (q: string) => ["geo-search", q] as const,
  reverse: (lat: number, lon: number) => ["geo-reverse", lat, lon] as const,
};

export const STALE = {
  current: 5 * 60 * 1000,
  forecast: 15 * 60 * 1000,
  air: 15 * 60 * 1000,
  geo: 24 * 60 * 60 * 1000,
};

export const AQI_SCALE: Record<1 | 2 | 3 | 4 | 5, { label: string; tone: string; color: string }> =
  {
    1: { label: "Good", tone: "Air quality is excellent.", color: "var(--aqi-good)" },
    2: { label: "Fair", tone: "Acceptable for most people.", color: "var(--aqi-fair)" },
    3: {
      label: "Moderate",
      tone: "Sensitive groups may be affected.",
      color: "var(--aqi-moderate)",
    },
    4: { label: "Poor", tone: "May cause health effects.", color: "var(--aqi-poor)" },
    5: {
      label: "Very Poor",
      tone: "Avoid prolonged exposure outdoors.",
      color: "var(--aqi-very-poor)",
    },
  };

export const TILE_LAYERS = [
  { id: "clouds_new", label: "Clouds" },
  { id: "precipitation_new", label: "Precipitation" },
  { id: "pressure_new", label: "Pressure" },
  { id: "wind_new", label: "Wind" },
  { id: "temp_new", label: "Temperature" },
] as const;

export type TileLayerId = (typeof TILE_LAYERS)[number]["id"];
