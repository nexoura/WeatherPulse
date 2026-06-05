import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/common/GlassCard";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — WeatherPulse" },
      {
        name: "description",
        content:
          "Read the rules, disclaimers, and user agreements governing the use of WeatherPulse.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  useEffect(() => {
    document.title = "Terms & Conditions — WeatherPulse";
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Terms & Conditions</h1>
        <p className="text-sm text-muted-foreground">Last updated: June 5, 2026</p>
      </header>

      <GlassCard className="p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-2.5 text-primary">
          <FileText className="size-5" />
          <h2 className="text-lg font-semibold text-foreground">Terms of Use</h2>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Welcome to **WeatherPulse**! These terms and conditions outline the rules and regulations
          for the use of WeatherPulse's Website, located at `https://theweatherpulse.in`.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          By accessing this website, we assume you accept these terms and conditions. Do not
          continue to use WeatherPulse if you do not agree to take all of the terms and conditions
          stated on this page.
        </p>

        <section className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">1. Terminology</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The following terminology applies to these Terms and Conditions, Privacy Statement and
            Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the
            person log on this website and compliant to the Company's terms and conditions. "The
            Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties",
            or "Us", refers to both the Client and ourselves.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">2. Cookies</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We employ the use of cookies. By accessing WeatherPulse, you agreed to use cookies in
            agreement with the WeatherPulse's Privacy Policy. Most interactive websites use cookies
            to let us retrieve the user's details for each visit. Cookies are used by our website to
            enable the functionality of certain areas to make it easier for people visiting our
            website. Some of our affiliate/advertising partners may also use cookies.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">
            3. License & Intellectual Property
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Unless otherwise stated, WeatherPulse and/or its licensors own the intellectual property
            rights for all material on WeatherPulse. All intellectual property rights are reserved.
            You may access this from WeatherPulse for your own personal use subjected to
            restrictions set in these terms and conditions.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">You must not:</p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-2">
            <li>Republish material from WeatherPulse</li>
            <li>Sell, rent or sub-license material from WeatherPulse</li>
            <li>Reproduce, duplicate or copy material from WeatherPulse</li>
            <li>Redistribute content from WeatherPulse</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">4. User Content & Postings</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Parts of this website may offer an opportunity for users to post and exchange opinions
            and information in certain areas of the website. WeatherPulse does not filter, edit,
            publish or review comments prior to their presence on the website. Comments do not
            reflect the views and opinions of WeatherPulse, its agents and/or affiliates. Comments
            reflect the views and opinions of the person who posts their views and opinions. To the
            extent permitted by applicable laws, WeatherPulse shall not be liable for the Comments
            or for any liability, damages or expenses caused and/or suffered as a result of any use
            of and/or posting of and/or appearance of the Comments on this website.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">
            5. Hyperlinking to our Content
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The following organizations may link to our Website without prior written approval:
            government agencies, search engines, news organizations, and online directory
            distributors. No use of WeatherPulse's logo or other artwork will be allowed for linking
            absent a trademark license agreement.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">6. Content Liability</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We shall not be held responsible for any content that appears on your Website. You agree
            to protect and defend us against all claims that are rising on your Website. No link(s)
            should appear on any Website that may be interpreted as libelous, obscene or criminal,
            or which infringes, otherwise violates, or advocates the infringement or other violation
            of, any third party rights.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">
            7. Disclaimer & Limitation of Liability
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To the maximum extent permitted by applicable law, we exclude all representations,
            warranties and conditions relating to our website and the use of this website. As long
            as the website and the information and services on the website are provided free of
            charge, we will not be liable for any loss or damage of any nature.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All weather information is provided "as is" and without warranties of accuracy. For
            actual safety guidance, users must cross-reference official regional bulletins.
          </p>
        </section>
      </GlassCard>
    </div>
  );
}
