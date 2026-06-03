import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GlassCard } from "@/components/common/GlassCard";
import { formatHour } from "@/utils/format";
import type { ForecastItem, Units } from "@/types/weather";
import { Thermometer, Droplets, Wind, CloudRain } from "lucide-react";

interface Props {
  items: ForecastItem[];
  tz: number;
  units?: Units;
}

const axisProps = {
  stroke: "transparent",
  tick: { fill: "currentColor", fontSize: 11, opacity: 0.5 },
  axisLine: false,
  tickLine: false,
};

const tooltipStyle = {
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    fontSize: 12,
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
  },
  labelStyle: { color: "var(--muted-foreground)", marginBottom: 4 },
};

function ChartHeader({
  icon,
  title,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span
        className="inline-flex size-7 items-center justify-center rounded-lg"
        style={{ background: `color-mix(in srgb, ${color} 18%, transparent)`, color }}
      >
        {icon}
      </span>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
    </div>
  );
}

export function TempTrendChart({ items, tz, units = "metric" }: Props) {
  const data = items.slice(0, 16).map((i) => ({
    t: formatHour(i.dt, tz),
    temp: Math.round(i.main.temp),
    feels: Math.round(i.main.feels_like),
  }));
  const tempUnit = units === "metric" ? "°C" : "°F";
  return (
    <GlassCard className="p-5">
      <ChartHeader
        icon={<Thermometer className="size-4" />}
        title={`Temperature trend (${tempUnit})`}
        color="#f97316"
      />
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGlow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
            <XAxis dataKey="t" {...axisProps} />
            <YAxis {...axisProps} width={30} domain={["dataMin - 2", "dataMax + 2"]} />
            <Tooltip {...tooltipStyle} />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="url(#tempGlow)"
              strokeWidth={3}
              dot={{ r: 3.5, fill: "#f97316", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#f97316", stroke: "white", strokeWidth: 2 }}
              isAnimationActive={true}
            />
            <Line
              type="monotone"
              dataKey="feels"
              stroke="var(--muted-foreground)"
              strokeDasharray="5 4"
              strokeWidth={1.5}
              dot={false}
              opacity={0.5}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex items-center gap-4 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-5 rounded-full bg-orange-500" /> Actual
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="h-px w-5 rounded-full bg-muted-foreground opacity-50"
            style={{ borderTop: "1px dashed" }}
          />{" "}
          Feels like
        </span>
      </div>
    </GlassCard>
  );
}

export function HumidityChart({ items, tz }: Props) {
  const data = items.slice(0, 16).map((i) => ({
    t: formatHour(i.dt, tz),
    hum: i.main.humidity,
  }));
  return (
    <GlassCard className="p-5">
      <ChartHeader icon={<Droplets className="size-4" />} title="Humidity (%)" color="#22d3ee" />
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="hu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
            <XAxis dataKey="t" {...axisProps} />
            <YAxis {...axisProps} width={30} domain={[0, 100]} />
            <Tooltip {...tooltipStyle} />
            <Area
              type="monotone"
              dataKey="hum"
              stroke="#22d3ee"
              strokeWidth={2.5}
              fill="url(#hu)"
              dot={{ r: 3, fill: "#22d3ee", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#22d3ee", stroke: "white", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

export function RainProbabilityChart({ items, tz }: Props) {
  const data = items.slice(0, 16).map((i) => ({
    t: formatHour(i.dt, tz),
    pop: Math.round((i.pop ?? 0) * 100),
  }));
  return (
    <GlassCard className="p-5">
      <ChartHeader
        icon={<CloudRain className="size-4" />}
        title="Rain probability (%)"
        color="#6366f1"
      />
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={14}>
            <defs>
              <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
            <XAxis dataKey="t" {...axisProps} />
            <YAxis {...axisProps} width={30} domain={[0, 100]} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="pop" fill="url(#rainGrad)" radius={[6, 6, 2, 2]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

export function WindChart({ items, tz, units = "metric" }: Props) {
  const isMetric = units === "metric";
  const data = items.slice(0, 16).map((i) => ({
    t: formatHour(i.dt, tz),
    wind: isMetric ? +(i.wind.speed * 3.6).toFixed(1) : +i.wind.speed.toFixed(1),
  }));
  const unitLabel = isMetric ? "km/h" : "mph";
  return (
    <GlassCard className="p-5">
      <ChartHeader
        icon={<Wind className="size-4" />}
        title={`Wind speed (${unitLabel})`}
        color="#a78bfa"
      />
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
            <XAxis dataKey="t" {...axisProps} />
            <YAxis {...axisProps} width={30} />
            <Tooltip {...tooltipStyle} />
            <Area
              type="monotone"
              dataKey="wind"
              stroke="#a78bfa"
              strokeWidth={2.5}
              fill="url(#windGrad)"
              dot={{ r: 3, fill: "#a78bfa", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#a78bfa", stroke: "white", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
