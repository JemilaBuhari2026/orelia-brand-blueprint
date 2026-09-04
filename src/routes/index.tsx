import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { Newsletter } from "@/components/site/Newsletter";
import { products, ingredients, articles } from "@/lib/brand";
import hero from "@/assets/hero.jpg";
import ingredientsImg from "@/assets/ingredients.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hey! You Wellness — African wellness food you can actually enjoy" },
      {
        name: "description",
        content:
          "A premium African wellness food brand connecting gut health, mood and everyday wellbeing through millet, cocoa, baobab and cassava.",
      },
      { property: "og:title", content: "Hey! You Wellness — wellness you can actually enjoy" },
      {
        property: "og:description",
        content: "Premium African wellness foods built around gut health, mood and everyday wellbeing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const pillars = [
  {
    title: "Good gut",
    body: "Fermented millet, fibre-rich tiger nut and live cultures — gut health built on food people already know.",
  },
  {
    title: "Good mood",
    body: "Products designed around the food and mood connection, for the middle of a long day.",
  },
  {
    title: "Good food",
    body: "If it doesn't taste like something you look forward to, it isn't finished.",
  },
];

function Home() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-24">
          <div className="fade-up">
            <p className="eyebrow text-primary">African wellness food</p>
            <h1 className="mt-5 font-display text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-[4.2rem]">
              Wellness you can <span className="text-primary">actually</span> enjoy.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Hey! You Wellness makes nourishing food that tastes like something you look forward to — built on
              African ingredients, gut health and the food and mood connection.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                See the products <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/story"
                className="inline-flex items-center rounded-full border border-cocoa/25 px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Our story
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-30px_rgba(74,44,30,0.45)]">
              <img
                src={hero}
                alt="Hands holding a mauve pouch of African superfoods beside cocoa pods, baobab and millet"
                width={1600}
                height={1200}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 hidden max-w-[15rem] rounded-2xl bg-accent px-6 py-5 text-accent-foreground shadow-lg sm:block">
              <p className="font-display text-xl leading-snug">Good mood. Good gut. Good food.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="grid gap-10 md:grid-cols-3">
            {pillars.map((p) => (
              <div key={p.title}>
                <h2 className="font-display text-2xl">{p.title}</h2>
                <p className="mt-3 text-primary-foreground/80">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-primary">The range</p>
            <h2 className="mt-3 font-display text-4xl">A growing family of feel-good food</h2>
          </div>
          <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            All products <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 3).map((p) => (
            <Link
              key={p.slug}
              to="/products/$slug"
              params={{ slug: p.slug }}
              className="group overflow-hidden rounded-3xl bg-card transition-transform hover:-translate-y-1"
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
                <p className="eyebrow text-accent">{p.family}</p>
                <h3 className="mt-2 font-display text-2xl">{p.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.proposition}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Ingredients */}
      <section className="bg-secondary">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-2 lg:items-center lg:px-8">
          <div className="overflow-hidden rounded-[2rem]">
            <img
              src={ingredientsImg}
              alt="Baobab, moringa, hibiscus, millet, tiger nuts, cocoa, dates and ginger in cream bowls"
              loading="lazy"
              width={1600}
              height={1008}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="eyebrow text-primary">African superfoods</p>
            <h2 className="mt-3 font-display text-4xl leading-tight">
              The best wellness ingredients already grow here
            </h2>
            <p className="mt-5 text-muted-foreground">
              Baobab, millet, tiger nut, moringa, hibiscus, cassava and cocoa. Not decoration, not an
              afterthought — the reason the products work.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {ingredients.slice(0, 6).map((i) => (
                <li
                  key={i.name}
                  className="rounded-full border border-cocoa/20 px-4 py-1.5 text-sm font-medium text-foreground"
                >
                  {i.name}
                </li>
              ))}
            </ul>
            <Link
              to="/superfoods"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              Explore the ingredient library <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Journal */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-primary">Wellness journal</p>
            <h2 className="mt-3 font-display text-4xl">Read something useful</h2>
          </div>
          <Link to="/journal" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            All articles <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {articles.slice(0, 3).map((a) => (
            <Link
              key={a.slug}
              to="/journal/$slug"
              params={{ slug: a.slug }}
              className="rounded-3xl border border-border bg-card p-7 transition-colors hover:border-primary/50"
            >
              <p className="eyebrow text-accent">{a.cluster}</p>
              <h3 className="mt-3 font-display text-2xl leading-snug">{a.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{a.excerpt}</p>
              <p className="mt-5 text-xs text-muted-foreground">{a.readingTime}</p>
            </Link>
          ))}
        </div>
      </section>

      <Newsletter tone="purple" />
    </Layout>
  );
}
