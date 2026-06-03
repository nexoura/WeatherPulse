import { useCallback, useState } from "react";
import { geocodingApi } from "@/services/geocodingApi";
import type { GeoLocation } from "@/types/weather";

export function useGeolocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detect = useCallback((): Promise<GeoLocation | null> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined" || !navigator.geolocation) {
        setError("Geolocation not supported");
        resolve(null);
        return;
      }
      setLoading(true);
      setError(null);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const place = await geocodingApi.reverse(pos.coords.latitude, pos.coords.longitude);
            setLoading(false);
            resolve(
              place ?? {
                name: "Current location",
                lat: pos.coords.latitude,
                lon: pos.coords.longitude,
                country: "",
              },
            );
          } catch (e) {
            setLoading(false);
            setError(e instanceof Error ? e.message : "Reverse geocoding failed");
            resolve(null);
          }
        },
        (err) => {
          setLoading(false);
          setError(err.message);
          resolve(null);
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 },
      );
    });
  }, []);

  return { detect, loading, error };
}
