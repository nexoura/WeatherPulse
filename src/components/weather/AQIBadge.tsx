import { GlassCard } from "@/components/common/GlassCard";
import { AQI_SCALE } from "@/config/constants";
import type { AirPollutionResponse } from "@/types/weather";
import { Link } from "@tanstack/react-router";

export function AQIBadge({ data }: { data: AirPollutionResponse | undefined }) {
  if (!data?.list?.[0]) return null;
  const aqi = data.list[0].main.aqi;
  const scale = AQI_SCALE[aqi];
  return (
    <Link to="/air-quality">
      <GlassCard className="flex items-center gap-4 p-4 transition-colors hover:bg-foreground/10">
        <div
          className="flex size-14 items-center justify-center rounded-2xl text-xl font-bold text-background"
          style={{ background: scale.color }}
        >
          {aqi}
        </div>
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Air quality</div>
          <div className="text-lg font-semibold">{scale.label}</div>
          <div className="truncate text-xs text-muted-foreground">{scale.tone}</div>
        </div>
      </GlassCard>
    </Link>
  );
}
