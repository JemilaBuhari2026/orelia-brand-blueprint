import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, Instagram, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Layout, PageHero } from "@/components/site/Layout";

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

const topics = ["General enquiry", "Stocking / wholesale", "Corporate wellness", "Gifting", "Press", "Partnership"];

function ContactPage() {
  const [sending, setSending] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Thank you — your message has been noted. We'll be in touch.");
      e.currentTarget?.reset?.();
    }, 500);
  }

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
            <Mail className="mt-1 size-5 text-primary" />
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-muted-foreground">hello@heyyouwellness.com</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Instagram className="mt-1 size-5 text-primary" />
            <div>
              <p className="font-semibold">Social</p>
              <p className="text-muted-foreground">@heyyouwellness</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 size-5 text-primary" />
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

        <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="topic" className="text-sm font-medium">
                What is this about?
              </label>
              <select
                id="topic"
                name="topic"
                className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                {topics.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={sending}
            className="mt-6 inline-flex h-12 items-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {sending ? "Sending…" : "Send message"}
          </button>
          <p className="mt-4 text-xs text-muted-foreground">
            Messages aren't delivered anywhere yet — connect a backend when you're ready to receive them.
          </p>
        </form>
      </section>
    </Layout>
  );
}
