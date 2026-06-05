// Sliding window rate limiter for client IPs
class RateLimiter {
  private windowSizeMs: number;
  private limit: number;
  private hits: Map<string, number[]>;

  constructor(limit = 60, windowSizeMs = 60 * 1000) {
    this.limit = limit;
    this.windowSizeMs = windowSizeMs;
    this.hits = new Map();

    // Periodically prune old entries to avoid memory growth
    if (typeof setInterval !== "undefined") {
      setInterval(() => this.prune(), 5 * 60 * 1000);
    }
  }

  public isRateLimited(ip: string): boolean {
    const now = Date.now();
    const timestamps = this.hits.get(ip) ?? [];

    // Keep only timestamps within the sliding window
    const validTimestamps = timestamps.filter((t) => now - t < this.windowSizeMs);

    if (validTimestamps.length >= this.limit) {
      this.hits.set(ip, validTimestamps);
      return true;
    }

    validTimestamps.push(now);
    this.hits.set(ip, validTimestamps);
    return false;
  }

  private prune() {
    const now = Date.now();
    for (const [ip, timestamps] of this.hits.entries()) {
      const valid = timestamps.filter((t) => now - t < this.windowSizeMs);
      if (valid.length === 0) {
        this.hits.delete(ip);
      } else {
        this.hits.set(ip, valid);
      }
    }
  }
}

// Export separate instances for standard API routes and map tiles
export const globalLimiter = new RateLimiter(60, 60 * 1000); // 60 requests per minute
export const tilesLimiter = new RateLimiter(300, 60 * 1000); // 300 requests per minute for map tiles

export function getClientIp(request: Request): string {
  const ipHeader =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "127.0.0.1";
  return ipHeader.split(",")[0].trim();
}
