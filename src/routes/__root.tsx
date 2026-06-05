/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Provider as ReduxProvider } from "react-redux";

import appCss from "../styles.css?url";
import { store, useAppSelector } from "@/redux/store";
import { TopNav } from "@/components/layout/TopNav";
import { MobileNav } from "@/components/layout/MobileNav";
import { Toaster } from "@/components/ui/sonner";
import { useTheme } from "@/hooks/useTheme";
import { currentQuery } from "@/services/queries";
import { WeatherBackground } from "@/components/weather/WeatherBackground";
import { AdVertical } from "@/components/ads/AdComponents";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          That route doesn't exist in this forecast.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Back to today
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-glass-border bg-glass px-4 py-2 text-sm font-medium transition-colors hover:bg-foreground/5"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "WeatherPulse — Modern Weather Forecast" },
      {
        name: "description",
        content:
          "WeatherPulse: Beautiful, real-time weather, current conditions, hourly + daily forecast, air quality, and interactive maps.",
      },
      { name: "theme-color", content: "#0F172A" },
      { property: "og:title", content: "WeatherPulse — Modern Weather Forecast" },
      {
        property: "og:description",
        content:
          "WeatherPulse: Beautiful, real-time weather, hourly + daily forecast, air quality, and interactive maps.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "google-site-verification", content: "uyNTWNoQ2eiTagFm5k_iGPaqwubKW1SJJyRXwih23Cg" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
        crossOrigin: "",
      },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/icon-192.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/icon-192.png" },
    ],
    scripts: [
      {
        src: "https://www.googletagmanager.com/gtag/js?id=G-55PSLWG9R9",
        async: true,
      },
      {
        children: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-55PSLWG9R9', { send_page_view: false });
        `,
      },
      {
        src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7862756622314744",
        async: true,
        crossOrigin: "anonymous",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function ThemeBridge() {
  // Keeps <html class="dark"> in sync with Redux on the client
  useTheme();
  return null;
}

function GlobalWeatherBackground() {
  const active = useAppSelector((s) => s.location.active);
  const units = useAppSelector((s) => s.weather.units);
  const { data } = useQuery(currentQuery(active.lat, active.lon, units));
  return <WeatherBackground icon={data?.weather[0]?.icon} />;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = router.subscribe("onResolved", () => {
      const path = router.state.resolvedLocation?.pathname;
      if (path && typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("config", "G-55PSLWG9R9", {
          page_path: path,
        });
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeBridge />
        <GlobalWeatherBackground />
        <div className="relative min-h-screen">
          <TopNav />
          <div className="mx-auto flex max-w-[1600px] justify-center gap-6 px-4">
            {/* LEFT vertical skyscraper ad — replace slot with real AdSense Ad Unit ID from AdSense Dashboard > Ads > By ad unit */}
            <aside className="sticky top-20 hidden h-[620px] w-[160px] shrink-0 xl:block pt-6">
              <AdVertical slot="REPLACE_WITH_REAL_SLOT_ID" />
            </aside>

            {/* Main Content */}
            <main className="flex-grow max-w-7xl pb-28 pt-6 md:pb-12 min-w-0">
              <Outlet />
            </main>

            {/* RIGHT vertical skyscraper ad — replace slot with real AdSense Ad Unit ID from AdSense Dashboard > Ads > By ad unit */}
            <aside className="sticky top-20 hidden h-[620px] w-[160px] shrink-0 xl:block pt-6">
              <AdVertical slot="REPLACE_WITH_REAL_SLOT_ID" />
            </aside>
          </div>
          <MobileNav />
        </div>
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </ReduxProvider>
  );
}
