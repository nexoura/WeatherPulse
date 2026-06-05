import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/common/GlassCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, MessageSquare, Send, CheckCircle2, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — WeatherPulse" },
      {
        name: "description",
        content:
          "Get in touch with the WeatherPulse support team for feedback, questions, or partnerships.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://theweatherpulse.in/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Contact Us",
              item: "https://theweatherpulse.in/contact",
            },
          ],
        }),
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  useEffect(() => {
    document.title = "Contact Us — WeatherPulse";
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Message sent! We will get back to you shortly.");
    }, 1200);
  };

  return (
    <div className="relative space-y-8 max-w-3xl mx-auto px-4 py-6 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -left-32 top-0 size-96 rounded-full bg-accent/8 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-20 size-80 rounded-full bg-primary/10 blur-3xl" />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-2 text-center"
      >
        <div className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/8 px-3 py-1 text-xs font-semibold text-accent">
          <MessageSquare className="size-3.5" />
          <span>Get In Touch</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Contact <span className="text-gradient-cool">WeatherPulse</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
          Have feedback, feature requests, or business inquiries? Drop us a message below.
        </p>
      </motion.header>

      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <GlassCard strong className="p-8 text-center space-y-6 border border-white/10 shadow-2xl">
            <div className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 shadow-inner">
              <CheckCircle2 className="size-9" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Message Sent Successfully!</h2>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out. Our support team will review your message and get back
                to you at <span className="font-semibold text-foreground">{email}</span> within 24
                hours.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSubmitted(false);
                setName("");
                setEmail("");
                setMessage("");
              }}
              className="rounded-full mt-4 hover:bg-foreground/5"
            >
              Send another message
            </Button>
          </GlassCard>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <GlassCard strong className="p-6 md:p-8 border border-white/10 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                      className="w-full rounded-xl border border-glass-border bg-foreground/3 px-4 py-3 text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 focus:bg-background/20 transition-all shadow-inner"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1"
                    >
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      required
                      className="w-full rounded-xl border border-glass-border bg-foreground/3 px-4 py-3 text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 focus:bg-background/20 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help you?"
                    required
                    rows={5}
                    className="w-full rounded-xl border border-glass-border bg-foreground/3 px-4 py-3 text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 focus:bg-background/20 transition-all resize-none shadow-inner"
                  />
                </div>

                <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full py-6 flex items-center justify-center gap-2 font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-95 transition-opacity"
                  >
                    <Send className="size-4" />
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </motion.div>
              </form>
            </GlassCard>
          </motion.div>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title: "Direct Support",
                value: "support@theweatherpulse.in",
                sub: "SLA: Response within 24 hours",
                icon: Mail,
                color: "text-primary bg-primary/10",
              },
              {
                title: "Partnerships",
                value: "partners@theweatherpulse.in",
                sub: "Media & business inquiries",
                icon: MessageSquare,
                color: "text-accent bg-accent/10",
              },
              {
                title: "Mailing Address",
                value: "WeatherPulse HQ",
                sub: "Ahmedabad, Gujarat, India",
                icon: MapPin,
                color: "text-emerald-500 bg-emerald-500/10",
              },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.2 + i * 0.05 }}
                  whileHover={{ y: -3, transition: { duration: 0.15 } }}
                >
                  <GlassCard className="p-5 flex flex-col items-start gap-3 justify-between h-full border border-white/6 hover:border-white/12 transition-all shadow-md">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`flex size-8 items-center justify-center rounded-lg ${card.color}`}
                      >
                        <Icon className="size-4" />
                      </span>
                      <h3 className="font-bold text-xs sm:text-sm text-foreground">{card.title}</h3>
                    </div>
                    <div className="space-y-0.5 mt-2">
                      <p className="text-xs text-foreground font-semibold tracking-tight leading-none">
                        {card.value}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium">{card.sub}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
