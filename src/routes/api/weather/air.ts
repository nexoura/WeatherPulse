import { createFileRoute } from "@tanstack/react-router";
import { globalLimiter, getClientIp } from "@/utils/rateLimiter";

const BASE = "https://api.openweathermap.org/data/2.5";

function bad(status: number, msg: string) {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: { 
      "Content-Type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate"
    },
  });
}

export const Route = createFileRoute("/api/weather/air")({
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
        const forecast = url.searchParams.get("forecast") === "1";
        if (!lat || !lon) return bad(400, "lat and lon are required");

        const path = forecast ? "air_pollution/forecast" : "air_pollution";
        const upstream = `${BASE}/${path}?lat=${lat}&lon=${lon}&appid=${key}`;
        
        try {
          const r = await fetch(upstream);
          
          // 2. Upstream Error Handling & Resiliency
          if (!r.ok) {
            if (r.status === 429) {
              return bad(429, "Air quality service is currently experiencing high load. Please try again soon.");
            }
            return bad(r.status, `OpenWeather error (${r.status})`);
          }
          
          const body = await r.text();
          
          // 3. Vercel CDN Cache Configuration (15 mins stale-while-revalidate)
          return new Response(body, {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "public, max-age=900, s-maxage=900, stale-while-revalidate=1800",
            },
          });
        } catch (error: any) {
          return bad(500, `Failed to contact upstream air quality service: ${error?.message || error}`);
        }
      },
    },
  },
});
