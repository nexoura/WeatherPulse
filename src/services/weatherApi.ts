import { api } from "@/config/axios";
import type {
  CurrentWeather,
  ForecastResponse,
  AirPollutionResponse,
  Units,
} from "@/types/weather";

export const weatherApi = {
  current: async (lat: number, lon: number, units: Units) => {
    const { data } = await api.get<CurrentWeather>("/weather/current", {
      params: { lat, lon, units },
    });
    return data;
  },
  forecast: async (lat: number, lon: number, units: Units) => {
    const { data } = await api.get<ForecastResponse>("/weather/forecast", {
      params: { lat, lon, units },
    });
    return data;
  },
  air: async (lat: number, lon: number) => {
    const { data } = await api.get<AirPollutionResponse>("/weather/air", {
      params: { lat, lon },
    });
    return data;
  },
  airForecast: async (lat: number, lon: number) => {
    const { data } = await api.get<AirPollutionResponse>("/weather/air", {
      params: { lat, lon, forecast: 1 },
    });
    return data;
  },
};
