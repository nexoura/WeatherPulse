import { useEffect, useMemo, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Locate, MapPin, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { geoSearchQuery } from "@/services/queries";
import { useDebounce } from "@/hooks/useDebounce";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setActive } from "@/redux/locationSlice";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 250);
  const { data, isFetching } = useQuery(geoSearchQuery(debouncedQ));
  const recent = useAppSelector((s) => s.location.recent);
  const favorites = useAppSelector((s) => s.location.favorites);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const geo = useGeolocation();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pick = (g: { name: string; lat: number; lon: number; country: string; state?: string }) => {
    dispatch(setActive(g));
    setOpen(false);
    setQ("");
    navigate({ to: "/" });
  };

  const useCurrent = async () => {
    const place = await geo.detect();
    if (place) {
      if (place.country !== "IN") {
        toast.error("WeatherPulse is restricted to locations within India only.");
        return;
      }
      pick(place);
    }
  };

  const items = useMemo(() => data ?? [], [data]);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="w-full justify-between rounded-full border-glass-border bg-glass text-muted-foreground sm:w-72"
      >
        <span className="inline-flex items-center gap-2">
          <Search className="size-4" /> Search any city…
        </span>
        <kbd className="hidden rounded bg-foreground/10 px-1.5 py-0.5 text-[10px] sm:inline">
          ⌘K
        </kbd>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 sm:max-w-xl">
          <DialogTitle className="sr-only">Search cities</DialogTitle>
          <Command shouldFilter={false}>
            <CommandInput
              value={q}
              onValueChange={setQ}
              placeholder="Search any city, town, or place…"
            />
            <CommandList>
              {isFetching && (
                <div className="px-4 py-2 text-xs text-muted-foreground">Searching…</div>
              )}
              <CommandEmpty>No matches yet — type at least 2 letters.</CommandEmpty>

              <CommandGroup heading="Actions">
                <CommandItem onSelect={useCurrent}>
                  <Locate className="mr-2 size-4" />
                  Use my current location
                </CommandItem>
              </CommandGroup>

              {items.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup heading="Cities">
                    {items.map((g, i) => (
                      <CommandItem
                        key={`${g.lat},${g.lon},${i}`}
                        value={`${g.name}-${i}`}
                        onSelect={() => pick(g)}
                      >
                        <MapPin className="mr-2 size-4 text-primary" />
                        <span className="font-medium">{g.name}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {g.state ? `${g.state}, ` : ""}
                          {g.country}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}

              {favorites.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup heading="Favorites">
                    {favorites.map((g) => (
                      <CommandItem
                        key={`fav-${g.id}`}
                        value={`fav-${g.id}`}
                        onSelect={() => pick(g)}
                      >
                        <MapPin className="mr-2 size-4 text-accent" />
                        {g.name}, {g.country}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}

              {recent.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup heading="Recent">
                    {recent.map((g, i) => (
                      <CommandItem
                        key={`recent-${g.lat}-${g.lon}-${i}`}
                        value={`recent-${g.name}-${i}`}
                        onSelect={() => pick(g)}
                      >
                        <MapPin className="mr-2 size-4 text-muted-foreground" />
                        {g.name}, {g.country}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
