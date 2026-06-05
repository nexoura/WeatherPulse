import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/common/GlassCard";
import { Info, HelpCircle, Server, Mail, Globe, Cpu, ShieldCheck, Activity } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — WeatherPulse" },
      {
        name: "description",
        content: "Learn about the mission, features, and weather data sources behind WeatherPulse.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  useEffect(() => {
    document.title = "About Us — WeatherPulse";
  }, []);

  return (
    <div className="relative space-y-8 max-w-4xl mx-auto px-4 py-6 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -right-32 top-0 size-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-20 size-80 rounded-full bg-accent/8 blur-3xl" />

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-2 text-center md:text-left"
      >
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
          <Info className="size-3.5" />
          <span>Our Story</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          About <span className="text-gradient-cool">WeatherPulse</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
          An elegant, clean weather platform offering real-time forecasts and visual overlays with zero clutter.
        </p>
      </motion.header>

      {/* Mission Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <GlassCard strong className="relative overflow-hidden p-6 md:p-8 space-y-4 border border-white/10 shadow-xl">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary to-accent" />
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Globe className="size-5" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Our Mission</h2>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            WeatherPulse was founded to solve a common problem: weather apps are often cluttered with invasive popups, confusing tables, and unnecessary fluff. We believe checking the weather should be an elegant, distraction-free experience. 
          </p>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            By combining a state-of-the-art glassmorphic design system with highly precise meteorological calculations, we deliver essential data (hourly trends, active alerts, AQI indicators, and interactive overlays) in a layout that feels both clean and visually premium.
          </p>
        </GlassCard>
      </motion.div>

      {/* Key Features Grid */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold uppercase tracking-[0.16em] text-muted-foreground text-center md:text-left">
          Key Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: "Real-Time Forecasts",
              desc: "Get instant, responsive updates on temperature, relative humidity, wind vectors, and active local alerts.",
              icon: Activity,
              color: "text-primary bg-primary/10",
            },
            {
              title: "Interactive Radar Maps",
              desc: "Pan and zoom across active precipitation, temperature, pressure, wind velocity, and cloud cover overlays.",
              icon: Globe,
              color: "text-accent bg-accent/10",
            },
            {
              title: "Air Quality Tracking",
              desc: "Monitor atmospheric particulate counts (PM2.5, PM10, CO, NO₂) paired with tailored safety recommendations.",
              icon: ShieldCheck,
              color: "text-emerald-500 bg-emerald-500/10",
            },
            {
              title: "Device-Local Privacy",
              desc: "Save and bookmark your favorite cities instantly. All search records and settings are stored locally on your browser.",
              icon: Cpu,
              color: "text-indigo-400 bg-indigo-400/10",
            },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 + i * 0.05 }}
                whileHover={{ y: -4, transition: { duration: 0.15 } }}
              >
                <GlassCard className="h-full p-5 flex gap-4 border border-white/6 hover:border-white/12 transition-all shadow-md">
                  <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${f.color}`}>
                    <Icon className="size-5" />
                  </span>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm sm:text-base text-foreground">{f.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Tech Stack & Methodology */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
      >
        <GlassCard className="p-6 md:p-8 space-y-5 border border-white/8 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <Server className="size-5" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Data Sources & Tech Stack</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To ensure reliable predictions, we aggregate meteorological data using verified feeds and perform client-side optimizations:
          </p>
          <div className="space-y-3 pl-2 border-l-2 border-primary/20">
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary">OpenWeather Integration</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                We pull active forecasts, hourly temperature maps, and atmospheric pressure trends through the OpenWeatherMap API, standardizing units dynamically.
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Dynamic Aggregation</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Multi-day trends are calculated by parsing three-hour intervals, utilizing weighted moving averages to filter out transient spikes in humidity and temperature.
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Engineering Stack</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Built as a Server-Side Rendered (SSR) app using React 19, TypeScript, TanStack Start, Redux Toolkit, and Tailwind CSS. Map overlays are rendered dynamically using Leaflet.js.
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Contact Callout */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.45 }}
      >
        <GlassCard className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10 bg-primary/5 shadow-lg">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-bold text-base sm:text-lg text-foreground flex items-center justify-center md:justify-start gap-2">
              <Mail className="size-4.5 text-primary" />
              Need Support or Have Feedback?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              We respond to all support requests and corporate partnership inquiries within 24 hours.
            </p>
          </div>
          <motion.a 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            href="/contact" 
            className="rounded-full bg-foreground text-background px-6 py-2 text-xs sm:text-sm font-semibold shadow-md hover:bg-foreground/90 transition-colors shrink-0 text-center"
          >
            Contact Support
          </motion.a>
        </GlassCard>
      </motion.div>
    </div>
  );
}
