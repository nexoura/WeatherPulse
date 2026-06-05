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

export const Route = createFileRoute("/api/geo/search")({
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
        const q = url.searchParams.get("q")?.trim();
        const limit = url.searchParams.get("limit") ?? "5";
        if (!q || q.length < 2) {
          return new Response(JSON.stringify([]), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control":
                "public, max-age=86400, s-maxage=86400, stale-while-revalidate=172800",
            },
          });
        }
        const upstream = `${BASE}/direct?q=${encodeURIComponent(q)}&limit=${limit}&appid=${key}`;

        try {
          const r = await fetch(upstream);

          // 2. Upstream Error Handling & Resiliency
          if (!r.ok) {
            if (r.status === 429) {
              return bad(
                429,
                "Geocoding search service is currently experiencing high load. Please try again soon.",
              );
            }
            return bad(r.status, `Geocoding error (${r.status})`);
          }

          const results = await r.json();
          const filtered = Array.isArray(results) ? results : [];

          // 3. Vercel CDN Cache Configuration (24 hours stale-while-revalidate)
          return new Response(JSON.stringify(filtered), {
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
            `Failed to contact upstream geocoding search service: ${error?.message || error}`,
          );
        }
      },
    },
  },
});
