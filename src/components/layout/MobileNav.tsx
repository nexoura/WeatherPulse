import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { CloudSun, CalendarDays, Wind, Map as MapIcon, Bookmark } from "lucide-react";

const links = [
  { to: "/", label: "Today", icon: CloudSun },
  { to: "/forecast", label: "Forecast", icon: CalendarDays },
  { to: "/air-quality", label: "Air", icon: Wind },
  { to: "/maps", label: "Maps", icon: MapIcon },
  { to: "/saved", label: "Saved", icon: Bookmark },
] as const;

export function MobileNav() {
  const loc = useLocation();
  return (
    <nav className="fixed bottom-3 left-1/2 z-40 -translate-x-1/2 md:hidden">
      <div className="glass-strong flex items-center gap-1 rounded-full px-1.5 py-1.5">
        {links.map((l) => {
          const active = loc.pathname === l.to;
          const Icon = l.icon;
          return (
            <Link
              key={l.to}
              to={l.to}
              aria-label={l.label}
              className={cn(
                "flex size-11 items-center justify-center rounded-full transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-foreground/10",
              )}
            >
              <Icon className="size-5" />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
