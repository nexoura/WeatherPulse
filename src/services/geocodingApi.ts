import { api } from "@/config/axios";
import type { GeoLocation } from "@/types/weather";

export const geocodingApi = {
  search: async (q: string): Promise<GeoLocation[]> => {
    const { data } = await api.get<GeoLocation[]>("/geo/search", {
      params: { q, limit: 6 },
    });
    return data;
  },
  reverse: async (lat: number, lon: number): Promise<GeoLocation | null> => {
    const { data } = await api.get<GeoLocation[]>("/geo/reverse", {
      params: { lat, lon },
    });
    return data[0] ?? null;
  },
};
