import { GlassCard } from "@/components/common/GlassCard";
import { AlertTriangle, Info } from "lucide-react";
import { motion } from "framer-motion";

export function AlertBanner({
  alerts,
}: {
  alerts: { level: "info" | "warning" | "danger"; title: string; detail: string }[];
}) {
  if (!alerts.length) return null;
  const tones = {
    info: "from-accent/40 to-accent/10",
    warning: "from-aqi-moderate/50 to-aqi-moderate/10",
    danger: "from-destructive/50 to-destructive/10",
  };
  return (
    <div className="space-y-2">
      {alerts.map((a, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <GlassCard className={`flex items-start gap-3 bg-gradient-to-r p-3 ${tones[a.level]}`}>
            {a.level === "info" ? (
              <Info className="mt-0.5 size-4 shrink-0" />
            ) : (
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            )}
            <div>
              <div className="text-sm font-semibold">{a.title}</div>
              <div className="text-xs text-muted-foreground">{a.detail}</div>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
