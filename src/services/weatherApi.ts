import { api } from "@/config/axios";
import type {
  CurrentWeather,
  ForecastResponse,
  AirPollutionResponse,
  Units,
} from "@/types/weather";

const cacheKey = (type: string, lat: number, lon: number, extra = "") =>
  `wp:offline-cache:${type}:${lat.toFixed(3)}:${lon.toFixed(3)}:${extra}`;

function getCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const item = JSON.parse(raw);
    return item.data as T;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, data: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // Ignore quota/private browsing issues
  }
}

export const weatherApi = {
  current: async (lat: number, lon: number, units: Units) => {
    const key = cacheKey("current", lat, lon, units);
    try {
      const { data } = await api.get<CurrentWeather>("/weather/current", {
        params: { lat, lon, units },
      });
      setCache(key, data);
      return data;
    } catch (err) {
      const cached = getCache<CurrentWeather>(key);
      if (cached) {
        return cached;
      }
      throw err;
    }
  },
  forecast: async (lat: number, lon: number, units: Units) => {
    const key = cacheKey("forecast", lat, lon, units);
    try {
      const { data } = await api.get<ForecastResponse>("/weather/forecast", {
        params: { lat, lon, units },
      });
      setCache(key, data);
      return data;
    } catch (err) {
      const cached = getCache<ForecastResponse>(key);
      if (cached) {
        return cached;
      }
      throw err;
    }
  },
  air: async (lat: number, lon: number) => {
    const key = cacheKey("air", lat, lon);
    try {
      const { data } = await api.get<AirPollutionResponse>("/weather/air", {
        params: { lat, lon },
      });
      setCache(key, data);
      return data;
    } catch (err) {
      const cached = getCache<AirPollutionResponse>(key);
      if (cached) {
        return cached;
      }
      throw err;
    }
  },
  airForecast: async (lat: number, lon: number) => {
    const key = cacheKey("air-forecast", lat, lon);
    try {
      const { data } = await api.get<AirPollutionResponse>("/weather/air", {
        params: { lat, lon, forecast: 1 },
      });
      setCache(key, data);
      return data;
    } catch (err) {
      const cached = getCache<AirPollutionResponse>(key);
      if (cached) {
        return cached;
      }
      throw err;
    }
  },
};
