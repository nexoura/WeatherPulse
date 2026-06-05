import { createFileRoute } from "@tanstack/react-router";
import { tilesLimiter, getClientIp } from "@/utils/rateLimiter";

// Splat route: /api/tiles/{layer}/{z}/{x}/{y}.png
// Proxies OpenWeatherMap tile server, injecting the API key server-side.
export const Route = createFileRoute("/api/tiles/$")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        // 1. IP-Based Rate Limiting for Tiles (higher threshold: 300/min)
        const ip = getClientIp(request);
        if (tilesLimiter.isRateLimited(ip)) {
          return new Response("Too many requests", { 
            status: 429,
            headers: { "Cache-Control": "no-store, no-cache, must-revalidate" }
          });
        }

        const key = process.env.OPENWEATHER_API_KEY || "7685c07abaaee0b4b61c5599d66262f2";
        const splat = params._splat ?? "";
        // Expect: layer/z/x/y.png
        const match = splat.match(/^([a-z0-9_]+)\/(\d+)\/(\d+)\/(\d+)\.png$/i);
        if (!match) return new Response("bad path", { status: 400 });
        const [, layer, z, x, y] = match;
        const upstream = `https://tile.openweathermap.org/map/${layer}/${z}/${x}/${y}.png?appid=${key}`;
        
        try {
          const r = await fetch(upstream);
          
          // 2. Upstream Error Handling
          if (!r.ok) {
            return new Response(`upstream error (${r.status})`, { 
              status: r.status,
              headers: { "Cache-Control": "no-store, no-cache, must-revalidate" }
            });
          }
          
          const buf = await r.arrayBuffer();
          
          // 3. Vercel CDN Cache Configuration (1 hour stale-while-revalidate)
          return new Response(buf, {
            status: 200,
            headers: {
              "Content-Type": "image/png",
              "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200, immutable",
            },
          });
        } catch (error: any) {
          return new Response(`Failed to load tile: ${error?.message || error}`, { status: 500 });
        }
      },
    },
  },
});
