/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";

const BASE = "https://api.openweathermap.org/geo/1.0";

function bad(status: number, msg: string) {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/api/geo/search")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const key = process.env.OPENWEATHER_API_KEY || "7685c07abaaee0b4b61c5599d66262f2";
        const url = new URL(request.url);
        const q = url.searchParams.get("q")?.trim();
        const limit = url.searchParams.get("limit") ?? "5";
        if (!q || q.length < 2) {
          return new Response(JSON.stringify([]), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
        let queryWithIndia = q;
        if (!q.toLowerCase().endsWith(",in") && !q.toLowerCase().endsWith(", india")) {
          queryWithIndia = `${q},IN`;
        }
        const upstream = `${BASE}/direct?q=${encodeURIComponent(queryWithIndia)}&limit=${limit}&appid=${key}`;
        const r = await fetch(upstream);
        if (!r.ok) return bad(r.status, `Geocoding error (${r.status})`);

        const results = await r.json();
        const filtered = Array.isArray(results)
          ? results.filter((item: any) => item.country === "IN")
          : [];

        return new Response(JSON.stringify(filtered), {
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
