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
        <div className="flex flex-col sm:flex-row gap-2">
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

      <GlassCard className="p-6 md:p-8 space-y-6">
        <header className="space-y-1">
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Settings & Data FAQ
          </h2>
          <p className="text-xs text-muted-foreground">
            Frequently asked questions about measurement units and your data privacy.
          </p>
        </header>

        <div className="space-y-4 text-xs text-muted-foreground leading-relaxed">
          <div>
            <strong className="text-foreground text-sm font-medium block mb-1">
              Metric vs. Imperial Units
            </strong>
            <p>
              WeatherPulse supports both measurement frameworks. The <strong>Metric</strong> system
              uses Celsius (°C) for temperature, kilometers per hour (km/h) for wind, and meters (m)
              for visibility. The <strong>Imperial</strong> system uses Fahrenheit (°F) for
              temperature, miles per hour (mph) for wind, and miles (mi) for visibility. Selecting a
              preference updates the entire application dynamically.
            </p>
          </div>
          <div>
            <strong className="text-foreground text-sm font-medium block mb-1">
              How is my location and settings data stored?
            </strong>
            <p>
              Your privacy is our utmost priority. All configurations (unit settings, color theme)
              and list of saved search locations are stored locally on your device using
              browser-based storage (LocalStorage). This data is processed client-side and is never
              uploaded, sold, or shared with external servers.
            </p>
          </div>
          <div>
            <strong className="text-foreground text-sm font-medium block mb-1">
              Third-Party Advertising Disclosures
            </strong>
            <p>
              WeatherPulse integrates with Google AdSense to serve non-intrusive advertisements.
              These services use third-party cookies to customize ad banners based on your search
              history and interests. You can manage cookies at any time through your browser's
              settings or read our dedicated{" "}
              <a href="/cookie-policy" className="text-primary hover:underline">
                Cookie Policy
              </a>
              .
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6 text-xs text-muted-foreground">
        WeatherPulse uses the OpenWeatherMap free tier. Hourly forecast is sampled at 3-hour
        intervals; severe-weather alerts are derived heuristics, not official government bulletins.
      </GlassCard>
    </div>
  );
}
