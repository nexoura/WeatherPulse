import { createFileRoute } from "@tanstack/react-router";

// Splat route: /api/tiles/{layer}/{z}/{x}/{y}.png
// Proxies OpenWeatherMap tile server, injecting the API key server-side.
export const Route = createFileRoute("/api/tiles/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const key = process.env.OPENWEATHER_API_KEY;
        if (!key) return new Response("missing key", { status: 500 });
        const splat = params._splat ?? "";
        // Expect: layer/z/x/y.png
        const match = splat.match(/^([a-z0-9_]+)\/(\d+)\/(\d+)\/(\d+)\.png$/i);
        if (!match) return new Response("bad path", { status: 400 });
        const [, layer, z, x, y] = match;
        const upstream = `https://tile.openweathermap.org/map/${layer}/${z}/${x}/${y}.png?appid=${key}`;
        const r = await fetch(upstream);
        if (!r.ok) return new Response("upstream error", { status: r.status });
        const buf = await r.arrayBuffer();
        return new Response(buf, {
          status: 200,
          headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=3600, immutable",
          },
        });
      },
    },
  },
});
