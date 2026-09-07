import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHero } from "@/components/site/Layout";
import { Newsletter } from "@/components/site/Newsletter";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
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

      <section className="shell section-y">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={i * 70}>
              <ProductCard product={p} />
            </Reveal>
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
