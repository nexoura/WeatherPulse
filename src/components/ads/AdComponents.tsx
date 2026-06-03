/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";

// Horizontal Banner Ad
export function AdBanner({ slot }: { slot: string }) {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense initialization failed:", err);
    }
  }, []);

  return (
    <div className="my-6 flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-glass-border bg-glass/10 p-3 text-center backdrop-blur-xl">
      <span className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1 block">
        Advertisement
      </span>
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: "90px" }}
        data-ad-client="ca-pub-7862756622314744"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

// Vertical Skyscraper Ad (160x600 or 120x600)
export function AdVertical({ slot }: { slot: string }) {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense initialization failed:", err);
    }
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-glass-border bg-glass/15 p-2 text-center backdrop-blur-xl">
      <span className="text-[9px] uppercase tracking-wider text-muted-foreground mb-2 block">
        Ad
      </span>
      <ins
        className="adsbygoogle"
        style={{ display: "inline-block", width: "160px", height: "600px" }}
        data-ad-client="ca-pub-7862756622314744"
        data-ad-slot={slot}
      />
    </div>
  );
}
