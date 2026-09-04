import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout, PageHero } from "@/components/site/Layout";
import { Newsletter } from "@/components/site/Newsletter";
import { products } from "@/lib/brand";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Products — Hey! You Wellness" },
      {
        name: "description",
        content:
          "Furafrost, Mood Bars, Crunch Sticks, Cocoa Boost, Hey! You Superfoods and Naija Cola — the Hey! You Wellness product family.",
      },
      { property: "og:title", content: "Products — Hey! You Wellness" },
      {
        property: "og:description",
        content: "The growing family of African wellness foods from Hey! You Wellness.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <Layout>
      <PageHero
        eyebrow="The range"
        title="Six ideas about feeling good"
        intro="Each product answers a real moment in the day — a slow morning, a long afternoon, a table full of people."
      />

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Link
              key={p.slug}
              to="/products/$slug"
              params={{ slug: p.slug }}
              className="group overflow-hidden rounded-3xl bg-card transition-transform hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="aspect-square w-full object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground">
                  {p.status}
                </span>
              </div>
              <div className="p-6">
                <p className="eyebrow text-accent">{p.family}</p>
                <h2 className="mt-2 font-display text-2xl">{p.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{p.proposition}</p>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-12 max-w-2xl text-sm text-muted-foreground">
          Products are shown for information while the range is in development. Prices, nutrition panels and
          online ordering will be added once formulations and packaging are final.
        </p>
      </section>

      <Newsletter tone="purple" />
    </Layout>
  );
}
