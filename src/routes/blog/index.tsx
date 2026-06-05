import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassCard } from "@/components/common/GlassCard";
import { ARTICLES } from "@/data/articles";
import { BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Weather Insights & Guides — WeatherPulse" },
      {
        name: "description",
        content:
          "Read our comprehensive weather guides, climate science breakdowns, and outdoor safety tips.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://theweatherpulse.in/",
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Blog",
              "item": "https://theweatherpulse.in/blog",
            },
          ],
        }),
      },
    ],
  }),
  component: BlogIndexPage,
});

function BlogIndexPage() {
  useEffect(() => {
    document.title = "Weather Insights & Guides — WeatherPulse";
  }, []);

  const [activeTab, setActiveTab] = useState<string>("All");
  const categories = ["All", "Guides", "Science", "Safety", "Technology"];

  const filteredArticles =
    activeTab === "All" ? ARTICLES : ARTICLES.filter((a) => a.category === activeTab);

  return (
    <div className="relative space-y-8 max-w-5xl mx-auto px-4 py-6 overflow-hidden">
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
          <BookOpen className="size-3.5" />
          <span>Insights & Research</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Weather <span className="text-gradient-cool">Insights</span> & Guides
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
          Deep dives into meteorological science, regional climate cycles, and essential outdoor
          safety strategies written by meteorologists.
        </p>
      </motion.header>

      {/* Category Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="no-scrollbar flex gap-1.5 overflow-x-auto rounded-full border border-glass-border bg-glass p-1 backdrop-blur-xl w-max max-w-full"
      >
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveTab(c)}
            className={`relative rounded-full px-4 py-1.5 text-xs font-bold tracking-tight transition-all focus:outline-none ${
              activeTab === c
                ? "bg-foreground text-background shadow-lg"
                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </motion.div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredArticles.map((a, i) => (
            <motion.div
              key={a.slug}
              layout
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.15 } }}
            >
              <GlassCard className="group flex flex-col h-full overflow-hidden border border-white/6 hover:border-white/12 transition-all shadow-md hover:shadow-xl">
                {/* Thumbnail Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-foreground/5 border-b border-glass-border">
                  <img
                    src={`${a.image.split("?")[0]}?w=600&auto=format&fit=crop&q=80&fm=webp`}
                    alt={a.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <span className="absolute left-3 top-3 rounded-md bg-background/85 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-foreground shadow-sm backdrop-blur">
                    {a.category}
                  </span>
                </div>

                {/* Card Body */}
                <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between gap-5">
                  <div className="space-y-3">
                    {/* Meta tags */}
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3 text-primary" />
                        {a.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3 text-accent" />
                        {a.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-extrabold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      <Link to="/blog/$slug" params={{ slug: a.slug }}>
                        {a.title}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {a.excerpt}
                    </p>
                  </div>

                  {/* Read Button */}
                  <div className="pt-2 border-t border-glass-border">
                    <Link
                      to="/blog/$slug"
                      params={{ slug: a.slug }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary group-hover:gap-2.5 transition-all"
                    >
                      Read Article
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
