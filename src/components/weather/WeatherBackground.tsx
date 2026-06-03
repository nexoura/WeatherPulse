import { useMemo } from "react";
import { motion } from "framer-motion";

function conditionFromIcon(icon: string | undefined) {
  if (!icon) return "clear";
  const code = icon.slice(0, 2);
  switch (code) {
    case "01":
      return "clear";
    case "02":
    case "03":
    case "04":
      return "cloud";
    case "09":
    case "10":
      return "rain";
    case "11":
      return "thunder";
    case "13":
      return "snow";
    case "50":
      return "mist";
    default:
      return "clear";
  }
}

const images: Record<string, string> = {
  clear: "/images/weather/clear.png",
  cloud: "/images/weather/cloud.png",
  rain: "/images/weather/rain.png",
  thunder: "/images/weather/thunder.png",
  snow: "/images/weather/snow.png",
  mist: "/images/weather/mist.png",
};

export function WeatherBackground({ icon }: { icon?: string }) {
  const kind = useMemo(() => conditionFromIcon(icon), [icon]);
  const drops = useMemo(() => {
    if (kind !== "rain" && kind !== "snow") return [];
    return Array.from({ length: kind === "rain" ? 60 : 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 4,
      duration: kind === "rain" ? 0.8 + Math.random() * 0.6 : 6 + Math.random() * 4,
    }));
  }, [kind]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-slate-50"
    >
      {/* Dynamic Background Image with Higher Visibility */}
      <motion.div
        key={kind}
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 0.65, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${images[kind]})` }}
      />

      {/* Light Aurora Ambient Overlay */}
      <div className="absolute inset-0 bg-aurora opacity-15 mix-blend-multiply" />

      {/* Softer Light Vignette Overlay to Keep Background Image Visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-white/20 to-white/45" />

      {/* Precipitation Particles (Rain/Snow) */}
      {drops.map((d) => (
        <motion.span
          key={d.id}
          className={
            kind === "rain"
              ? "absolute top-[-10%] block h-10 w-px bg-primary/25"
              : "absolute top-[-10%] block size-1.5 rounded-full bg-primary/20"
          }
          style={{ left: `${d.left}%` }}
          initial={{ y: "-10vh", opacity: 0 }}
          animate={{ y: "110vh", opacity: [0, 1, 1, 0] }}
          transition={{
            duration: d.duration,
            repeat: Infinity,
            repeatType: "loop",
            delay: d.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
