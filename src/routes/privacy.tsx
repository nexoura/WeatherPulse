import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/common/GlassCard";
import { ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — WeatherPulse" },
      {
        name: "description",
        content:
          "Learn how WeatherPulse collects, uses, and protects user data in compliance with Google AdSense program policies.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  useEffect(() => {
    document.title = "Privacy Policy — WeatherPulse";
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: June 5, 2026</p>
      </header>

      <GlassCard className="p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-2.5 text-primary">
          <ShieldAlert className="size-5" />
          <h2 className="text-lg font-semibold text-foreground">Introduction</h2>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          At **WeatherPulse**, accessible from `https://theweatherpulse.in`, one of our main
          priorities is the privacy of our visitors. This Privacy Policy document contains types of
          information that is collected and recorded by WeatherPulse and how we use it.
        </p>

        <section className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">1. Log Files</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            WeatherPulse follows a standard procedure of using log files. These files log visitors
            when they visit websites. All hosting companies do this and a part of hosting services'
            analytics. The information collected by log files includes internet protocol (IP)
            addresses, browser type, Internet Service Provider (ISP), date and time stamp,
            referring/exit pages, and possibly the number of clicks. These are not linked to any
            information that is personally identifiable. The purpose of the information is for
            analyzing trends, administering the site, tracking users' movement on the website, and
            gathering demographic information.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">2. Cookies and Web Beacons</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Like any other website, WeatherPulse uses "cookies". These cookies are used to store
            information including visitors' preferences, and the pages on the website that the
            visitor accessed or visited. The information is used to optimize the users' experience
            by customizing our web page content based on visitors' browser type and/or other
            information.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">
            3. Google DoubleClick DART Cookie
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Google is one of the third-party vendors on our site. It also uses cookies, known as
            DART cookies, to serve ads to our site visitors based upon their visit to
            `https://theweatherpulse.in` and other sites on the internet. However, visitors may
            choose to decline the use of DART cookies by visiting the Google ad and content network
            Privacy Policy at the following URL:{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              https://policies.google.com/technologies/ads
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">4. Our Advertising Partners</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Some of the advertisers on our site may use cookies and web beacons. Our advertising
            partners include:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-2">
            <li>
              <strong>Google AdSense:</strong> Google's privacy policy can be viewed at{" "}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                https://policies.google.com/technologies/ads
              </a>
              .
            </li>
          </ul>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            These third-party ad servers or ad networks use technologies like cookies, JavaScript,
            or Web Beacons that are used in their respective advertisements and links that appear on
            WeatherPulse, which are sent directly to users' browsers. They automatically receive
            your IP address when this occurs. These technologies are used to measure the
            effectiveness of their advertising campaigns and/or to personalize the advertising
            content that you see on websites that you visit.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Note that WeatherPulse has no access to or control over these cookies that are used by
            third-party advertisers.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">
            5. Third-Party Privacy Policies
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            WeatherPulse's Privacy Policy does not apply to other advertisers or websites. Thus, we
            are advising you to consult the respective Privacy Policies of these third-party ad
            servers for more detailed information. It may include their practices and instructions
            about how to opt-out of certain options.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You can choose to disable cookies through your individual browser options. To know more
            detailed information about cookie management with specific web browsers, it can be found
            at the browsers' respective websites.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">6. Children's Information</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Another part of our priority is adding protection for children while using the internet.
            We encourage parents and guardians to observe, participate in, and/or monitor and guide
            their online activity.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            WeatherPulse does not knowingly collect any Personal Identifiable Information from
            children under the age of 13. If you think that your child provided this kind of
            information on our website, we strongly encourage you to contact us immediately and we
            will do our best efforts to promptly remove such information from our records.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">7. Consent</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            By using our website, you hereby consent to our Privacy Policy and agree to its Terms
            and Conditions.
          </p>
        </section>
      </GlassCard>
    </div>
  );
}
