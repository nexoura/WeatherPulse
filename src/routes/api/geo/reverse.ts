/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { globalLimiter, getClientIp } from "@/utils/rateLimiter";

const BASE = "https://api.openweathermap.org/geo/1.0";

function bad(status: number, msg: string) {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}

export const Route = createFileRoute("/api/geo/reverse")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // 1. IP-Based Rate Limiting
        const ip = getClientIp(request);
        if (globalLimiter.isRateLimited(ip)) {
          return bad(429, "Too many requests. Please try again later.");
        }

        const key = process.env.OPENWEATHER_API_KEY || "7685c07abaaee0b4b61c5599d66262f2";
        const url = new URL(request.url);
        const lat = url.searchParams.get("lat");
        const lon = url.searchParams.get("lon");
        if (!lat || !lon) return bad(400, "lat and lon are required");

        const upstream = `${BASE}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${key}`;

        try {
          const r = await fetch(upstream);

          // 2. Upstream Error Handling & Resiliency
          if (!r.ok) {
            if (r.status === 429) {
              return bad(
                429,
                "Geocoding service is currently experiencing high load. Please try again soon.",
              );
            }
            return bad(r.status, `Geocoding error (${r.status})`);
          }

          const body = await r.text();

          // 3. Vercel CDN Cache Configuration (24 hours stale-while-revalidate)
          return new Response(body, {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control":
                "public, max-age=86400, s-maxage=86400, stale-while-revalidate=172800",
            },
          });
        } catch (error: any) {
          return bad(
            500,
            `Failed to contact upstream geocoding service: ${error?.message || error}`,
          );
        }
      },
    },
  },
});
