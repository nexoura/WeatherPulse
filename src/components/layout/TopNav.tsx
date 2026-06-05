import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  CloudSun,
  CalendarDays,
  Wind,
  Map as MapIcon,
  Bookmark,
  Settings as SettingsIcon,
  BookOpen,
} from "lucide-react";
import { SearchCommand } from "./SearchCommand";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { toggleUnits } from "@/redux/weatherSlice";

const links = [
  { to: "/", label: "Today", icon: CloudSun },
  { to: "/forecast", label: "Forecast", icon: CalendarDays },
  { to: "/air-quality", label: "Air", icon: Wind },
  { to: "/maps", label: "Maps", icon: MapIcon },
  { to: "/saved", label: "Saved", icon: Bookmark },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
  { to: "/blog", label: "Blog", icon: BookOpen },
] as const;

export function TopNav() {
  const loc = useLocation();
  const units = useAppSelector((s) => s.weather.units);
  const dispatch = useAppDispatch();

  return (
    <header className="sticky top-0 z-40 border-b border-glass-border bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="WeatherPulse Logo"
            className="size-9 rounded-full object-cover object-top border border-glass-border shadow-inner"
          />
          <span className="hidden text-base font-semibold tracking-tight sm:inline">
            WeatherPulse
          </span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = loc.pathname === l.to;
            const Icon = l.icon;
            return (
              <Link
                key={l.to}
                to={l.to}
                title={l.label}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-primary/15 text-foreground"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                <span className="hidden lg:inline">{l.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <SearchCommand />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(toggleUnits())}
            className="hidden rounded-full sm:inline-flex"
            aria-label="Toggle units"
          >
            °{units === "metric" ? "C" : "F"}
          </Button>
        </div>
      </div>
    </header>
  );
}
