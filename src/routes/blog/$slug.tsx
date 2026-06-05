import { useEffect } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { GlassCard } from "@/components/common/GlassCard";
import { ARTICLES } from "@/data/articles";
import { Calendar, Clock, ArrowLeft, BookOpen, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const article = ARTICLES.find(a => a.slug === params.slug);
    if (!article) {
      throw notFound();
    }
    return { article };
  },
  head: ({ loaderData }) => {
    const article = loaderData?.article;
    return {
      meta: [
        { title: `${article?.title} — WeatherPulse` },
        { name: "description", content: article?.excerpt },
        { property: "og:title", content: `${article?.title} — WeatherPulse` },
        { property: "og:description", content: article?.excerpt },
        { property: "og:image", content: article?.image },
        { property: "og:type", content: "article" },
      ],
      scripts: article
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                headline: article.title,
                description: article.excerpt,
                image: article.image,
                datePublished: new Date(article.date).toISOString().split("T")[0] + "T12:00:00+05:30",
                author: {
                  "@type": "Organization",
                  name: "WeatherPulse Editorial",
                  url: "https://theweatherpulse.in",
                },
                publisher: {
                  "@type": "Organization",
                  name: "WeatherPulse",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://theweatherpulse.in/icon-192.png",
                  },
                },
                mainEntityOfPage: {
                  "@type": "WebPage",
                  "@id": `https://theweatherpulse.in/blog/${article.slug}`,
                },
              }),
            },
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
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": article.title,
                    "item": `https://theweatherpulse.in/blog/${article.slug}`,
                  },
                ],
              }),
            },
          ]
        : [],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const { article } = Route.useLoaderData();

  useEffect(() => {
    if (article) {
      document.title = `${article.title} — WeatherPulse`;
    }
  }, [article]);

  if (!article) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <GlassCard className="p-8 text-center space-y-4 border-destructive/20 shadow-2xl">
          <AlertCircle className="mx-auto size-12 text-destructive" />
          <h2 className="text-xl font-bold">Article not found</h2>
          <p className="text-sm text-muted-foreground">The article you are trying to view does not exist or has been removed.</p>
          <Link to="/blog" className="inline-block mt-4">
            <Button className="rounded-full">Back to blog</Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="relative space-y-6 max-w-3xl mx-auto px-4 py-6 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -right-32 top-0 size-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-20 size-80 rounded-full bg-accent/8 blur-3xl" />

      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to Insights
        </Link>
      </motion.div>

      <motion.article
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05 }}
      >
        <GlassCard className="overflow-hidden border border-white/10 shadow-2xl">
          {/* Banner Image */}
          <div className="aspect-[21/9] w-full overflow-hidden bg-foreground/5 border-b border-glass-border">
            <img
              src={`${article.image.split("?")[0]}?w=1200&auto=format&fit=crop&q=80&fm=webp`}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.01]"
            />
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-10 space-y-6">
            {/* Metadata */}
            <div className="space-y-4">
              <span className="inline-block rounded-md bg-primary/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-primary">
                {article.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground font-semibold">
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-primary" />
                  {article.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5 text-accent" />
                  {article.readTime}
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="size-3.5 text-emerald-500" />
                  By WeatherPulse Editorial
                </span>
              </div>
            </div>

            <hr className="border-glass-border" />

            {/* Article Text */}
            <div
              className="text-sm sm:text-base text-foreground/80 leading-relaxed space-y-6
                [&>h2]:text-xl sm:[&>h2]:text-2xl [&>h2]:font-extrabold [&>h2]:text-foreground [&>h2]:mt-8 [&>h2]:mb-3 [&>h2]:tracking-tight
                [&>h3]:text-lg sm:[&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-foreground [&>h3]:mt-6 [&>h3]:mb-3
                [&>p]:text-muted-foreground [&>p]:leading-relaxed [&>p]:text-[13px] sm:[&>p]:text-[15px]
                [&>ul]:list-disc [&>ul]:list-inside [&>ul]:text-muted-foreground [&>ul]:space-y-2 [&>ul]:pl-3 [&>ul]:text-[13px] sm:[&>ul]:text-[15px]
                [&>ol]:list-decimal [&>ol]:list-inside [&>ol]:text-muted-foreground [&>ol]:space-y-2 [&>ol]:pl-3 [&>ol]:text-[13px] sm:[&>ol]:text-[15px]
                [&>strong]:text-foreground [&>strong]:font-bold
                [&>a]:text-primary [&>a]:hover:underline [&>a]:font-medium"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </GlassCard>
      </motion.article>
    </div>
  );
}
