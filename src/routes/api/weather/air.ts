import { createFileRoute } from "@tanstack/react-router";

const BASE = "https://api.openweathermap.org/data/2.5";

function bad(status: number, msg: string) {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/api/weather/air")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const key = process.env.OPENWEATHER_API_KEY || "7685c07abaaee0b4b61c5599d66262f2";

        const url = new URL(request.url);
        const lat = url.searchParams.get("lat");
        const lon = url.searchParams.get("lon");
        const forecast = url.searchParams.get("forecast") === "1";
        if (!lat || !lon) return bad(400, "lat and lon are required");

        const path = forecast ? "air_pollution/forecast" : "air_pollution";
        const upstream = `${BASE}/${path}?lat=${lat}&lon=${lon}&appid=${key}`;
        const r = await fetch(upstream);
        if (!r.ok) return bad(r.status, `OpenWeather error (${r.status})`);
        const body = await r.text();
        return new Response(body, {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=900",
          },
        });
      },
    },
  },
});
