import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { removeFavorite, setActive } from "@/redux/locationSlice";
import { GlassCard } from "@/components/common/GlassCard";
import { Button } from "@/components/ui/button";
import { MapPin, Trash2 } from "lucide-react";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved Cities — WeatherPulse" },
      {
        name: "description",
        content: "Quick access to your favorite cities and recent searches.",
      },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const favs = useAppSelector((s) => s.location.favorites);
  const recent = useAppSelector((s) => s.location.recent);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Saved Cities — WeatherPulse";
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Saved cities</h1>
        <p className="text-sm text-muted-foreground">Tap any card to view its forecast.</p>
      </header>

      <section>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">Favorites</h2>
        {favs.length === 0 ? (
          <GlassCard className="p-6 text-sm text-muted-foreground">
            No favorites yet. Save a city from the home page using the “+” button.
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {favs.map((f) => (
              <GlassCard
                key={f.id}
                className="group relative cursor-pointer p-5 transition-colors hover:bg-foreground/5"
                onClick={() => {
                  dispatch(setActive(f));
                  navigate({ to: "/" });
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="size-3.5" />
                      {f.country}
                    </div>
                    <div className="mt-1 text-xl font-semibold">{f.name}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${f.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(removeFavorite(f.id));
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">Recent searches</h2>
        {recent.length === 0 ? (
          <GlassCard className="p-6 text-sm text-muted-foreground">
            Recent cities appear here after you search.
          </GlassCard>
        ) : (
          <div className="flex flex-wrap gap-2">
            {recent.map((r, i) => (
              <button
                key={`${r.lat}-${r.lon}-${i}`}
                onClick={() => {
                  dispatch(setActive(r));
                  navigate({ to: "/" });
                }}
                className="rounded-full border border-glass-border bg-glass px-3 py-1.5 text-sm hover:bg-foreground/10"
              >
                {r.name}
                {r.country ? `, ${r.country}` : ""}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
