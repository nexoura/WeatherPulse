import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  CloudSun,
  CalendarDays,
  Wind,
  Map as MapIcon,
  Bookmark,
  Menu,
  Settings as SettingsIcon,
  BookOpen,
  Info,
  Mail,
  FileText,
  ShieldAlert,
  Scale,
  Cookie,
  Thermometer,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setUnits } from "@/redux/weatherSlice";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Today", icon: CloudSun },
  { to: "/forecast", label: "Forecast", icon: CalendarDays },
  { to: "/air-quality", label: "Air", icon: Wind },
  { to: "/maps", label: "Maps", icon: MapIcon },
] as const;

export function MobileNav() {
  const loc = useLocation();
  const dispatch = useAppDispatch();
  const units = useAppSelector((s) => s.weather.units);

  return (
    <nav className="fixed bottom-3 left-1/2 z-40 -translate-x-1/2 md:hidden">
      <div className="glass-strong flex items-center gap-1 rounded-full px-1.5 py-1.5 shadow-lg">
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
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-foreground/10",
              )}
            >
              <Icon className="size-5" />
            </Link>
          );
        })}

        {/* More Sheet Trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <button
              aria-label="More options"
              className={cn(
                "flex size-11 items-center justify-center rounded-full transition-colors text-muted-foreground hover:bg-foreground/10 cursor-pointer",
              )}
            >
              <Menu className="size-5" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="rounded-t-[2rem] border-t border-glass-border bg-background/90 backdrop-blur-xl p-6 sm:p-8 outline-none"
          >
            <SheetHeader className="text-left border-b border-glass-border pb-4 mb-4">
              <SheetTitle className="text-lg font-bold tracking-tight">
                WeatherPulse Menu
              </SheetTitle>
            </SheetHeader>

            <div className="space-y-6 overflow-y-auto max-h-[70vh] no-scrollbar">
              {/* Primary Navigation Links */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    to: "/saved",
                    label: "Saved",
                    icon: Bookmark,
                    color: "text-accent bg-accent/10",
                  },
                  {
                    to: "/settings",
                    label: "Settings",
                    icon: SettingsIcon,
                    color: "text-primary bg-primary/10",
                  },
                  {
                    to: "/blog",
                    label: "Blog",
                    icon: BookOpen,
                    color: "text-emerald-500 bg-emerald-500/10",
                  },
                  {
                    to: "/about",
                    label: "About",
                    icon: Info,
                    color: "text-amber-500 bg-amber-500/10",
                  },
                  {
                    to: "/contact",
                    label: "Contact",
                    icon: Mail,
                    color: "text-indigo-400 bg-indigo-400/10",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const active = loc.pathname === item.to;
                  return (
                    <SheetClose asChild key={item.to}>
                      <Link
                        to={item.to}
                        className={cn(
                          "flex flex-col items-center justify-center gap-2 rounded-2xl p-3 border border-glass-border/60 hover:bg-foreground/5 transition-all text-center",
                          active
                            ? "bg-primary/10 border-primary/20 text-primary"
                            : "text-foreground",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-9 items-center justify-center rounded-xl",
                            item.color,
                          )}
                        >
                          <Icon className="size-4.5" />
                        </span>
                        <span className="text-xs font-bold">{item.label}</span>
                      </Link>
                    </SheetClose>
                  );
                })}
              </div>

              {/* Units Toggle Quick Setting */}
              <div className="rounded-2xl border border-glass-border bg-foreground/3 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Thermometer className="size-4 text-primary" />
                    <span className="text-sm font-semibold">Temperature Units</span>
                  </div>
                  <div className="flex gap-1.5">
                    {(["metric", "imperial"] as const).map((u) => (
                      <Button
                        key={u}
                        size="sm"
                        variant={units === u ? "default" : "outline"}
                        onClick={() => dispatch(setUnits(u))}
                        className="rounded-full text-xs font-bold py-1 px-3.5 h-8 hover:bg-foreground/5 cursor-pointer"
                      >
                        {u === "metric" ? "°C" : "°F"}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Policies and Disclaimers */}
              <div className="space-y-2.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">
                  Policies & Legal
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { to: "/privacy", label: "Privacy Policy", icon: ShieldAlert },
                    { to: "/terms", label: "Terms & Conditions", icon: Scale },
                    { to: "/disclaimer", label: "Disclaimer", icon: FileText },
                    { to: "/cookie-policy", label: "Cookie Policy", icon: Cookie },
                  ].map((policy) => {
                    const Icon = policy.icon;
                    const active = loc.pathname === policy.to;
                    return (
                      <SheetClose asChild key={policy.to}>
                        <Link
                          to={policy.to}
                          className={cn(
                            "flex items-center gap-2 rounded-xl border border-glass-border/40 p-2.5 hover:bg-foreground/5 transition-all text-xs font-semibold",
                            active
                              ? "bg-primary/5 text-primary border-primary/10"
                              : "text-muted-foreground",
                          )}
                        >
                          <Icon className="size-3.5 shrink-0 text-muted-foreground" />
                          <span className="truncate">{policy.label}</span>
                        </Link>
                      </SheetClose>
                    );
                  })}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
