import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setUnits } from "@/redux/weatherSlice";
import { clearRecent } from "@/redux/locationSlice";
import { GlassCard } from "@/components/common/GlassCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — WeatherPulse" },
      {
        name: "description",
        content: "Choose temperature units, theme, and manage your data.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { units } = useAppSelector((s) => s.weather);
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.title = "Settings — WeatherPulse";
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Personalize WeatherPulse to your taste.</p>
      </header>

      <GlassCard className="p-6">
        <h2 className="mb-3 text-sm uppercase tracking-wider text-muted-foreground">Units</h2>
        <div className="flex gap-2">
          {(["metric", "imperial"] as const).map((u) => (
            <Button
              key={u}
              variant={units === u ? "default" : "outline"}
              onClick={() => dispatch(setUnits(u))}
              className="rounded-full"
            >
              {u === "metric" ? "Celsius · km/h" : "Fahrenheit · mph"}
            </Button>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h2 className="mb-3 text-sm uppercase tracking-wider text-muted-foreground">Data</h2>
        <Button variant="outline" onClick={() => dispatch(clearRecent())} className="rounded-full">
          Clear recent searches
        </Button>
      </GlassCard>

      <GlassCard className="p-6 text-xs text-muted-foreground">
        WeatherPulse uses the OpenWeatherMap free tier. Hourly forecast is sampled at 3-hour
        intervals; severe-weather alerts are derived heuristics, not official government bulletins.
      </GlassCard>
    </div>
  );
}
