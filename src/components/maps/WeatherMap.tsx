import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { TileLayerId } from "@/config/constants";
import { useAppSelector } from "@/redux/store";

export function WeatherMap({ lat, lon, layer }: { lat: number; lon: number; layer: TileLayerId }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const overlayRef = useRef<L.TileLayer | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const basemapRef = useRef<L.TileLayer | null>(null);
  const labelsRef = useRef<L.TileLayer | null>(null);
  const theme = useAppSelector((s) => s.weather.theme);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const indiaBounds = L.latLngBounds([6.5546, 68.1114], [35.6745, 97.3956]);
    const map = L.map(ref.current, {
      center: [lat, lon],
      zoom: 7,
      minZoom: 4,
      maxBounds: indiaBounds,
      maxBoundsViscosity: 1.0,
      zoomControl: true,
      attributionControl: false,
      worldCopyJump: true,
    });

    const labelsPane = map.createPane("labelsPane");
    labelsPane.style.zIndex = "500";
    labelsPane.style.pointerEvents = "none";

    const isDark = theme === "dark";

    const baseTile = L.tileLayer(
      isDark
        ? "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png"
        : "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
      { maxZoom: 19, subdomains: "abcd" },
    ).addTo(map);
    basemapRef.current = baseTile;

    const labelTile = L.tileLayer(
      isDark
        ? "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png"
        : "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
      { maxZoom: 19, subdomains: "abcd", pane: "labelsPane" },
    ).addTo(map);
    labelsRef.current = labelTile;

    const icon = L.divIcon({
      className: "",
      html: `<div style="position:relative;width:18px;height:18px;">
        <div style="position:absolute;inset:0;border-radius:9999px;background:rgba(34,211,238,.35);animation:atmos-ping 1.6s ease-out infinite;"></div>
        <div style="position:absolute;inset:5px;border-radius:9999px;background:#22d3ee;box-shadow:0 0 12px rgba(34,211,238,.9);"></div>
      </div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });
    markerRef.current = L.marker([lat, lon], { icon }).addTo(map);

    mapRef.current = map;

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapRef.current = null;
      basemapRef.current = null;
      labelsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const isDark = theme === "dark";

    if (basemapRef.current) {
      basemapRef.current.setUrl(
        isDark
          ? "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png"
          : "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
      );
    }

    if (labelsRef.current) {
      labelsRef.current.setUrl(
        isDark
          ? "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png"
          : "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
      );
    }
  }, [theme]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setView([lat, lon], map.getZoom(), { animate: true });
    markerRef.current?.setLatLng([lat, lon]);
    map.invalidateSize();
  }, [lat, lon]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (overlayRef.current) {
      map.removeLayer(overlayRef.current);
      overlayRef.current = null;
    }
    const tl = L.tileLayer(`/api/tiles/${layer}/{z}/{x}/{y}.png`, {
      opacity: 0.85,
      maxNativeZoom: 12,
      maxZoom: 19,
      pane: "overlayPane",
    });
    tl.addTo(map);
    overlayRef.current = tl;
  }, [layer]);

  return (
    <div
      ref={ref}
      className="h-[380px] sm:h-[460px] md:h-[560px] w-full overflow-hidden rounded-2xl"
      style={{ background: theme === "dark" ? "#0b1220" : "#f1f5f9" }}
    />
  );
}
