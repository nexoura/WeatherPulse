import { createFileRoute } from "@tanstack/react-router";

const BASE = "https://api.openweathermap.org/data/2.5";

function bad(status: number, msg: string) {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/api/weather/current")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const key = process.env.OPENWEATHER_API_KEY;
        if (!key) return bad(500, "Server missing OPENWEATHER_API_KEY");

        const url = new URL(request.url);
        const lat = url.searchParams.get("lat");
        const lon = url.searchParams.get("lon");
        const units = url.searchParams.get("units") ?? "metric";
        if (!lat || !lon) return bad(400, "lat and lon are required");

        const upstream = `${BASE}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${key}`;
        const r = await fetch(upstream);
        if (!r.ok) return bad(r.status, `OpenWeather error (${r.status})`);
        const body = await r.text();
        return new Response(body, {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=300",
          },
        });
      },
    },
  },
});
