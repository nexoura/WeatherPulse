import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { removeFavorite, setActive, reorderFavorites } from "@/redux/locationSlice";
import { GlassCard } from "@/components/common/GlassCard";
import { Button } from "@/components/ui/button";
import { MapPin, Trash2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved Cities — WeatherPulse" },
      {
        name: "description",
        content: "Quick access to your favorite cities and recent searches.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://theweatherpulse.in/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Saved Cities",
              item: "https://theweatherpulse.in/saved",
            },
          ],
        }),
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

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    document.title = "Saved Cities — WeatherPulse";
  }, []);

  // HTML5 Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent, targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const reordered = [...favs];
    const item = reordered[draggedIndex];

    // Remove the item from dragged position
    reordered.splice(draggedIndex, 1);
    // Insert at target position
    reordered.splice(targetIndex, 0, item);

    setDraggedIndex(targetIndex);
    dispatch(reorderFavorites(reordered));
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 py-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Saved cities</h1>
        <p className="text-sm text-muted-foreground">
          Drag and drop cities to prioritize them, or tap any card to view its forecast.
        </p>
      </header>

      <section>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">Favorites</h2>
        {favs.length === 0 ? (
          <GlassCard className="p-6 text-sm text-muted-foreground">
            No favorites yet. Save a city from the home page using the “+” button.
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {favs.map((f, index) => {
              const isDragging = draggedIndex === index;
              return (
                <GlassCard
                  key={f.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    "group relative cursor-grab active:cursor-grabbing p-5 transition-all duration-200 border select-none",
                    isDragging
                      ? "opacity-40 border-dashed border-primary bg-primary/5 scale-[0.98] shadow-none"
                      : "border-glass-border hover:bg-foreground/5 hover:border-glass-border-hover shadow-md hover:shadow-lg",
                  )}
                  onClick={() => {
                    dispatch(setActive(f));
                    navigate({ to: "/" });
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2.5">
                      <GripVertical className="size-4 mt-1.5 text-muted-foreground/30 group-hover:text-muted-foreground/70 cursor-grab active:cursor-grabbing transition-colors" />
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="size-3.5" />
                          {f.country}
                        </div>
                        <div className="mt-1 text-xl font-semibold">{f.name}</div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove ${f.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(removeFavorite(f.id));
                      }}
                      className="hover:bg-destructive/10 hover:text-destructive transition-colors rounded-full"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </GlassCard>
              );
            })}
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
