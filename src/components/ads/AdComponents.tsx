/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";

// Waits for window.adsbygoogle to be available, then pushes the ad unit.
// Retries up to ~3s to handle async script load timing.
function pushAd(retries = 30) {
  if (typeof window === "undefined") return;
  if ((window as any).adsbygoogle !== undefined) {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense push failed:", err);
    }
  } else if (retries > 0) {
    setTimeout(() => pushAd(retries - 1), 100);
  }
}

// Horizontal Banner Ad (e.g. 728x90 leaderboard or responsive)
export function AdBanner({ slot }: { slot: string }) {
  const ref = useRef<HTMLModElement>(null);

  useEffect(() => {
    // Avoid double-push on strict-mode double-invocation
    if (ref.current && ref.current.getAttribute("data-ad-status")) return;
    pushAd();
  }, [slot]);

  return (
    <div className="my-6 flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-glass-border bg-glass/10 p-3 text-center backdrop-blur-xl">
      <span className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1 block">
        Advertisement
      </span>
      <ins
        ref={ref}
        key={slot}
        className="adsbygoogle"
        style={{ display: "block", minHeight: "90px", width: "100%" }}
        data-ad-client="ca-pub-7862756622314744"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

// Vertical Skyscraper Ad (160x600)
export function AdVertical({ slot }: { slot: string }) {
  const ref = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.getAttribute("data-ad-status")) return;
    pushAd();
  }, [slot]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-glass-border bg-glass/15 p-2 text-center backdrop-blur-xl">
      <span className="text-[9px] uppercase tracking-wider text-muted-foreground mb-2 block">
        Ad
      </span>
      <ins
        ref={ref}
        key={slot}
        className="adsbygoogle"
        style={{ display: "inline-block", width: "160px", height: "600px" }}
        data-ad-client="ca-pub-7862756622314744"
        data-ad-slot={slot}
      />
    </div>
  );
}
