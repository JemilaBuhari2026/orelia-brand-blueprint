import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { Newsletter } from "@/components/site/Newsletter";
import { CtaLink } from "@/components/site/Cta";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ProductCard } from "@/components/site/ProductCard";
import { ArticleCard } from "@/components/site/ArticleCard";
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
    index: "01",
    title: "Good gut",
    body: "Fermented millet, fibre-rich tiger nut and live cultures — gut health built on food people already know.",
  },
  {
    index: "02",
    title: "Good mood",
    body: "Products designed around the food and mood connection, for the middle of a long day.",
  },
  {
    index: "03",
    title: "Good food",
    body: "If it doesn't taste like something you look forward to, it isn't finished.",
  },
];

function Home() {
  return (
    <Layout>
      {/* 01 — Hero */}
      <section className="relative overflow-hidden">
        <div className="shell grid gap-12 pb-16 pt-10 lg:grid-cols-[1.02fr_1fr] lg:items-center lg:gap-20 lg:pb-24 lg:pt-16">
          <div className="fade-up">
            <p className="eyebrow text-primary">African wellness food</p>
            <h1 className="mt-5 display-1">
              Wellness you can <span className="text-primary">actually</span> enjoy.
            </h1>
            <p className="mt-6 max-w-lg lede text-muted-foreground">
              Hey! You Wellness makes nourishing food that tastes like something you look forward to — built on
              African ingredients, gut health and the food and mood connection.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <CtaLink to="/products" size="lg">
                Explore our goodness <ArrowRight className="size-4" />
              </CtaLink>
              <CtaLink to="/story" variant="secondary" size="lg">
                Discover our story
              </CtaLink>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[1.75rem] shadow-editorial">
              <img
                src={hero}
                alt="Hands holding a mauve pouch of African superfoods beside cocoa pods, baobab and millet"
                width={1600}
                height={1200}
                className="aspect-[4/5] w-full object-cover sm:aspect-[5/4] lg:aspect-[4/5]"
              />
            </div>
            <div className="absolute -bottom-7 -left-3 hidden max-w-[15rem] rounded-2xl bg-accent px-6 py-5 text-accent-foreground shadow-lift sm:block">
              <p className="font-display text-xl leading-snug">Good mood. Good gut. Good food.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — Brand promise */}
      <section className="grain relative overflow-hidden bg-primary text-primary-foreground">
        <div className="shell section-y">
          <Reveal>
            <p className="eyebrow text-primary-foreground/65">Why we exist</p>
            <p className="mt-6 max-w-4xl font-display text-[1.9rem] leading-[1.22] sm:text-4xl lg:text-[2.9rem]">
              Wellness should not feel like punishment. It should feel like something you want to come back to.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-10 border-t border-primary-foreground/15 pt-12 md:grid-cols-3">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <p className="meta font-semibold text-primary-foreground/50">{p.index}</p>
                <h2 className="mt-3 display-3">{p.title}</h2>
                <p className="mt-3 text-primary-foreground/80">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 03 — Product discovery */}
      <section className="shell section-y">
        <SectionHeading
          eyebrow="The range"
          title="A growing family of feel-good food"
          action={
            <CtaLink to="/products" variant="quiet">
              All products <ArrowRight className="size-4" />
            </CtaLink>
          }
        />
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {products.slice(0, 3).map((p, i) => (
            <Reveal key={p.slug} delay={i * 90}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* 04 — Ingredient story */}
      <section className="bg-secondary">
        <div className="shell grid gap-12 section-y lg:grid-cols-2 lg:items-center lg:gap-20">
          <Reveal className="overflow-hidden rounded-[1.75rem] shadow-lift">
            <img
              src={ingredientsImg}
              alt="Baobab, moringa, hibiscus, millet, tiger nuts, cocoa, dates and ginger in cream bowls"
              loading="lazy"
              width={1600}
              height={1008}
              className="aspect-[5/4] w-full object-cover"
            />
          </Reveal>
          <Reveal delay={80}>
            <p className="eyebrow text-primary">African superfoods</p>
            <h2 className="mt-3 display-2">The best wellness ingredients already grow here</h2>
            <p className="mt-5 text-muted-foreground">
              Baobab, millet, tiger nut, moringa, hibiscus, cassava and cocoa. Not decoration, not an
              afterthought — the reason the products work.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {ingredients.slice(0, 6).map((i) => (
                <li
                  key={i.name}
                  className="rounded-full border border-leaf/35 bg-background/60 px-4 py-1.5 text-sm font-medium text-foreground"
                >
                  {i.name}
                </li>
              ))}
            </ul>
            <CtaLink to="/superfoods" variant="quiet" className="mt-8">
              Explore the ingredient library <ArrowRight className="size-4" />
            </CtaLink>
          </Reveal>
        </div>
      </section>

      {/* 05 — Founder */}
      <section className="shell section-y">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-accent">Behind the brand</p>
          <p className="mt-6 font-display text-2xl leading-snug sm:text-3xl">
            “The ingredients the rest of the world calls superfoods are sold on the roadside here every single
            day. We just thought they deserved better food built around them.”
          </p>
          <CtaLink to="/story" variant="quiet" className="mt-8">
            Read our story <ArrowRight className="size-4" />
          </CtaLink>
        </Reveal>
      </section>

      {/* 06 — Journal */}
      <section className="shell pb-24">
        <SectionHeading
          eyebrow="Wellness journal"
          title="Read something useful"
          action={
            <CtaLink to="/journal" variant="quiet">
              All articles <ArrowRight className="size-4" />
            </CtaLink>
          }
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {articles.slice(0, 3).map((a, i) => (
            <Reveal key={a.slug} delay={i * 80} className="flex">
              <ArticleCard article={a} className="w-full" />
            </Reveal>
          ))}
        </div>
      </section>

      <Newsletter tone="purple" />
    </Layout>
  );
}
