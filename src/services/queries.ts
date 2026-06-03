import { queryOptions } from "@tanstack/react-query";
import { QUERY_KEYS, STALE } from "@/config/constants";
import { weatherApi } from "@/services/weatherApi";
import { geocodingApi } from "@/services/geocodingApi";
import type { Units } from "@/types/weather";

export const currentQuery = (lat: number, lon: number, units: Units) =>
  queryOptions({
    queryKey: QUERY_KEYS.current(lat, lon, units),
    queryFn: () => weatherApi.current(lat, lon, units),
    staleTime: STALE.current,
  });

export const forecastQuery = (lat: number, lon: number, units: Units) =>
  queryOptions({
    queryKey: QUERY_KEYS.forecast(lat, lon, units),
    queryFn: () => weatherApi.forecast(lat, lon, units),
    staleTime: STALE.forecast,
  });

export const airQuery = (lat: number, lon: number) =>
  queryOptions({
    queryKey: QUERY_KEYS.air(lat, lon),
    queryFn: () => weatherApi.air(lat, lon),
    staleTime: STALE.air,
  });

export const airForecastQuery = (lat: number, lon: number) =>
  queryOptions({
    queryKey: QUERY_KEYS.airForecast(lat, lon),
    queryFn: () => weatherApi.airForecast(lat, lon),
    staleTime: STALE.air,
  });

export const geoSearchQuery = (q: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.geoSearch(q),
    queryFn: () => geocodingApi.search(q),
    staleTime: STALE.geo,
    enabled: q.trim().length >= 2,
  });
