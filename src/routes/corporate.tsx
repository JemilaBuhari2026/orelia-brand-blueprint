import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout, PageHero } from "@/components/site/Layout";
import { products } from "@/lib/brand";

export const Route = createFileRoute("/corporate")({
  head: () => ({
    meta: [
      { title: "Corporate & Gifting — Hey! You Wellness" },
      {
        name: "description",
        content:
          "Employee wellness, hospitality partnerships, retail stocking and premium seasonal gifting with Hey! You Wellness.",
      },
      { property: "og:title", content: "Corporate & Gifting — Hey! You Wellness" },
      {
        property: "og:description",
        content: "Wellness programmes, hospitality partnerships and premium gifting from Hey! You Wellness.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CorporatePage,
});

const partners = [
  {
    title: "Employee wellness",
    body: "Wellness programmes, office subscriptions and staff appreciation moments that people actually look forward to.",
  },
  {
    title: "Gyms & studios",
    body: "Post-session snacks and drinks that match the standard of the space they're sold in.",
  },
  {
    title: "Cafés & hospitality",
    body: "Hotels, cafés and lounges looking for a distinctive African wellness offer on the counter.",
  },
  {
    title: "Retail & wholesale",
    body: "Supermarkets, pharmacies and health stores. Shelf-ready, photogenic and easy to explain.",
  },
];

const gifting = [
  "Ramadan gifting",
  "Christmas hampers",
  "Valentine's gifting",
  "Mother's Day",
  "Weddings and private events",
  "Premium client gifts",
];

export function CorporatePage() {
  return (
    <Layout>
      <PageHero
        eyebrow="Corporate & gifting"
        title="Wellness worth putting your name on"
        intro="Hey! You works as an everyday product and as a gesture — for teams, guests, partners and the people you want to thank."
      />

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2">
          {partners.map((p) => (
            <div key={p.title} className="rounded-3xl border border-border bg-card p-8">
              <h2 className="font-display text-2xl">{p.title}</h2>
              <p className="mt-3 text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <p className="eyebrow text-primary">Gifting</p>
          <h2 className="mt-3 font-display text-4xl">Built into the brand, not bolted on</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Gifting is designed as part of the Hey! You world — the same purple, the same materials, the same
            standard — rather than an improvised seasonal product.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {gifting.map((g) => (
              <li key={g} className="rounded-full border border-cocoa/20 px-4 py-2 text-sm font-medium">
                {g}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <p className="eyebrow text-primary">What can go in a box</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {products.slice(0, 3).map((p) => (
            <Link
              key={p.slug}
              to="/products/$slug"
              params={{ slug: p.slug }}
              className="overflow-hidden rounded-3xl bg-card transition-transform hover:-translate-y-1"
            >
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                width={1024}
                height={1024}
                className="aspect-square w-full object-cover"
              />
              <div className="p-6">
                <h3 className="font-display text-xl">{p.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center lg:px-8">
          <h2 className="font-display text-4xl">Let's talk volumes</h2>
          <p className="mt-4 text-primary-foreground/85">
            Tell us the occasion, the quantity and the timing, and we'll come back with what's possible.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
          >
            Start a conversation
          </Link>
        </div>
      </section>
    </Layout>
  );
}
