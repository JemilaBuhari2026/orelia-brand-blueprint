import { createFileRoute } from "@tanstack/react-router";
import { Mail, Instagram, MapPin } from "lucide-react";
import { Layout, PageHero } from "@/components/site/Layout";
import { EnquiryForm } from "@/components/site/EnquiryForm";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Hey! You Wellness" },
      {
        name: "description",
        content:
          "Get in touch with Hey! You Wellness about stocking, wholesale, corporate wellness, gifting or partnerships.",
      },
      { property: "og:title", content: "Contact — Hey! You Wellness" },
      { property: "og:description", content: "Stockists, wholesale, corporate wellness, gifting and partnerships." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <Layout>
      <PageHero
        eyebrow="Contact"
        title="Say hey"
        intro="Stockists, wholesale, corporate wellness, gifting, press or partnerships — we read everything."
      />

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1fr_1.2fr] lg:px-8">
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <Mail className="mt-1 size-5 text-primary" aria-hidden="true" />
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-muted-foreground">hello@heyyouwellness.com</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Instagram className="mt-1 size-5 text-primary" aria-hidden="true" />
            <div>
              <p className="font-semibold">Social</p>
              <p className="text-muted-foreground">@heyyouwellness</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 size-5 text-primary" aria-hidden="true" />
            <div>
              <p className="font-semibold">Based in</p>
              <p className="text-muted-foreground">Lagos, Nigeria</p>
            </div>
          </div>
          <p className="rounded-2xl bg-secondary p-5 text-sm text-muted-foreground">
            These contact details are placeholders drafted from your brand plan. Send us the real address, phone
            number and social handles and they'll be updated.
          </p>
        </div>

        <EnquiryForm showCompany />
      </section>
    </Layout>
  );
}

