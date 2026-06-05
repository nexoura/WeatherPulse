import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/common/GlassCard";
import { Cookie } from "lucide-react";

export const Route = createFileRoute("/cookie-policy")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — WeatherPulse" },
      {
        name: "description",
        content:
          "Learn how cookies are used to enhance your experience and serve personalized ads on WeatherPulse.",
      },
    ],
  }),
  component: CookiePolicyPage,
});

function CookiePolicyPage() {
  useEffect(() => {
    document.title = "Cookie Policy — WeatherPulse";
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Cookie Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: June 5, 2026</p>
      </header>

      <GlassCard className="p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-2.5 text-primary">
          <Cookie className="size-5" />
          <h2 className="text-lg font-semibold text-foreground">What Are Cookies?</h2>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          This Cookie Policy explains what cookies are and how we use them on **WeatherPulse**
          (`https://theweatherpulse.in`). You should read this policy to understand what types of
          cookies we use, the information we collect using cookies, and how that information is
          used.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Cookies are small text files that are used to store small pieces of information. They are
          stored on your device when the website is loaded on your browser. These cookies help us
          make the website function properly, make it more secure, provide better user experience,
          and analyze what works and where it needs improvement.
        </p>

        <section className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">1. How We Use Cookies</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            As most of the online services, our website uses first-party and third-party cookies for
            several purposes.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            **First-party cookies** are mostly necessary for the website to function the right way
            (e.g. keeping track of your active location search settings and units choice in Redux
            storage). They do not collect any of your personally identifiable data.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            **Third-party cookies** used on our website are mainly for understanding how the website
            performs, how you interact with our website, keeping our services secure, providing
            advertisements that are relevant to you, and all in all providing you with a better and
            improved user experience.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">2. Types of Cookies We Use</h3>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="border-l-2 border-primary pl-4 py-1">
              <strong className="text-foreground">Necessary / Functional Cookies:</strong>
              <p className="mt-1 text-xs">
                Essential cookies that enable core features like theme selection, units toggle
                (Metric vs. Imperial), and bookmarking your favorite cities in local storage.
              </p>
            </div>
            <div className="border-l-2 border-primary pl-4 py-1">
              <strong className="text-foreground">Analytical / Performance Cookies:</strong>
              <p className="mt-1 text-xs">
                Used to collect statistical visitor data via Google Analytics (e.g., page views,
                session duration, and geographical stats) to help us analyze site traffic and
                improve performance.
              </p>
            </div>
            <div className="border-l-2 border-primary pl-4 py-1">
              <strong className="text-foreground">Advertising / Marketing Cookies:</strong>
              <p className="mt-1 text-xs">
                Set by third-party advertising systems (like Google AdSense) to deliver targeted ads
                based on your interests. They track your visits across other websites to show
                relevant product banners.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">3. How Can I Control Cookies?</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You can manage your cookie preferences through your web browser settings. Most browsers
            allow you to refuse to accept cookies or delete existing cookies.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To opt-out of Google's use of cookies for interest-based advertising, you can customize
            your preferences or opt-out entirely by visiting the{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Ads Settings
            </a>{" "}
            page.
          </p>
        </section>
      </GlassCard>
    </div>
  );
}
