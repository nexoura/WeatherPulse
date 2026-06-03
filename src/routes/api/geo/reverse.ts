import { createFileRoute } from "@tanstack/react-router";

const BASE = "https://api.openweathermap.org/geo/1.0";

function bad(status: number, msg: string) {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/api/geo/reverse")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const key = process.env.OPENWEATHER_API_KEY;
        if (!key) return bad(500, "Server missing OPENWEATHER_API_KEY");
        const url = new URL(request.url);
        const lat = url.searchParams.get("lat");
        const lon = url.searchParams.get("lon");
        if (!lat || !lon) return bad(400, "lat and lon are required");
        const upstream = `${BASE}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${key}`;
        const r = await fetch(upstream);
        if (!r.ok) return bad(r.status, `Geocoding error (${r.status})`);
        const body = await r.text();
        return new Response(body, {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=86400",
          },
        });
      },
    },
  },
});
