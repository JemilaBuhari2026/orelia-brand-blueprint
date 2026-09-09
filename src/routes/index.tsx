import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { Newsletter } from "@/components/site/Newsletter";
import { CtaLink } from "@/components/site/Cta";
import { Reveal } from "@/components/site/Reveal";
import { Parallax } from "@/components/site/Motion";
import {
  HeyYouAccent,
  HeyYouBlob,
  HeyYouBurst,
  HeyYouFloatingDecoration,
  HeyYouHeart,
  HeyYouSpark,
} from "@/components/site/Decor";
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
      {/* 01 — Hero (Level 5 — feature moment) */}
      <section className="relative overflow-hidden">
        <HeyYouBlob
          tone="purple"
          shape="a"
          opacity={0.16}
          blur
          className="-left-40 -top-32 size-[34rem]"
        />
        <HeyYouBlob
          tone="lime"
          shape="c"
          opacity={0.28}
          blur
          className="-right-24 top-40 size-[26rem]"
        />

        <div className="shell relative grid gap-12 pb-16 pt-10 lg:grid-cols-[1.02fr_1fr] lg:items-center lg:gap-20 lg:pb-24 lg:pt-16">
          <div>
            <p className="eyebrow fade-up text-accent">African wellness food</p>
            <h1 className="mt-5 display-1 fade-up" style={{ animationDelay: "90ms" }}>
              Wellness you can{" "}
              <span className="relative inline-block text-primary">
                actually
                <HeyYouAccent
                  tone="orange"
                  className="absolute -bottom-1 left-0 h-3 w-full"
                  opacity={0.9}
                />
              </span>{" "}
              enjoy.
            </h1>
            <p
              className="mt-6 max-w-lg lede fade-up text-muted-foreground"
              style={{ animationDelay: "180ms" }}
            >
              Hey! You Wellness makes nourishing food that tastes like something you look forward to — built on
              African ingredients, gut health and the food and mood connection.
            </p>
            <div className="mt-9 flex flex-wrap gap-3 fade-up" style={{ animationDelay: "270ms" }}>
              <CtaLink to="/products" size="lg">
                Explore our goodness <ArrowRight className="size-4" />
              </CtaLink>
              <CtaLink to="/story" variant="secondary" size="lg">
                Discover our story
              </CtaLink>
            </div>
          </div>

          <div className="relative">
            <Parallax speed={-0.08}>
              <div className="relative overflow-hidden rounded-[2.25rem] shadow-editorial">
                <img
                  src={hero}
                  alt="Hands holding a mauve pouch of African superfoods beside cocoa pods, baobab and millet"
                  width={1600}
                  height={1200}
                  className="aspect-[4/5] w-full object-cover sm:aspect-[5/4] lg:aspect-[4/5]"
                />
              </div>
            </Parallax>

            <HeyYouFloatingDecoration className="-left-6 top-8 hidden sm:block" duration={11}>
              <HeyYouBurst tone="orange" className="size-16" />
            </HeyYouFloatingDecoration>
            <HeyYouFloatingDecoration className="-right-4 top-1/3" duration={13} delay={0.6}>
              <HeyYouHeart tone="lime" className="size-12 drop-shadow-sm" />
            </HeyYouFloatingDecoration>
            <HeyYouFloatingDecoration className="bottom-16 -left-8 hidden lg:block" duration={9} delay={1.2}>
              <HeyYouSpark tone="gold" className="h-14 w-10" />
            </HeyYouFloatingDecoration>

            <div className="absolute -bottom-7 -left-3 hidden max-w-[15rem] rounded-[1.4rem] bg-accent px-6 py-5 text-accent-foreground shadow-lift sm:block">
              <p className="font-display text-xl leading-snug">Good mood. Good gut. Good food.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — Brand promise (scroll storytelling) */}
      <section className="grain relative overflow-hidden bg-primary text-primary-foreground">
        <HeyYouBlob
          tone="purple-deep"
          shape="b"
          opacity={0.55}
          blur
          className="-right-32 -top-24 size-[30rem]"
        />
        <HeyYouFloatingDecoration className="left-6 top-10 opacity-40" duration={14}>
          <HeyYouSpark tone="lime" className="h-16 w-11" />
        </HeyYouFloatingDecoration>

        <div className="shell relative section-y">
          <Reveal>
            <p className="eyebrow text-primary-foreground/65">Why we exist</p>
          </Reveal>
          <Reveal variant="blur" delay={120}>
            <p className="mt-6 max-w-4xl font-display text-[1.9rem] leading-[1.22] sm:text-4xl lg:text-[2.9rem]">
              Wellness should not feel like punishment.
            </p>
          </Reveal>
          <Reveal variant="blur" delay={320}>
            <p className="mt-3 max-w-4xl font-display text-[1.9rem] leading-[1.22] text-lime sm:text-4xl lg:text-[2.9rem]">
              It should feel like something you want to come back to.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-10 border-t border-primary-foreground/15 pt-12 md:grid-cols-3">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <p className="meta font-semibold text-lime/80">{p.index}</p>
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
      <section className="relative overflow-hidden bg-secondary">
        <HeyYouBlob tone="gold" shape="a" opacity={0.3} blur className="-left-28 bottom-0 size-[24rem]" />
        <div className="shell relative grid gap-12 section-y lg:grid-cols-2 lg:items-center lg:gap-20">
          <div className="relative">
            <Parallax speed={0.06}>
              <Reveal variant="mask" className="overflow-hidden rounded-[1.75rem] shadow-lift">
                <img
                  src={ingredientsImg}
                  alt="Baobab, moringa, hibiscus, millet, tiger nuts, cocoa, dates and ginger in cream bowls"
                  loading="lazy"
                  width={1600}
                  height={1008}
                  className="aspect-[5/4] w-full object-cover"
                />
              </Reveal>
            </Parallax>
            <HeyYouFloatingDecoration className="-right-5 -top-6 hidden sm:block" duration={12}>
              <HeyYouBurst tone="lime" className="size-14" />
            </HeyYouFloatingDecoration>
          </div>
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
                  className="rounded-full border-2 border-lime/60 bg-background/70 px-4 py-1.5 text-sm font-medium text-foreground transition-colors duration-300 hover:border-lime hover:bg-lime/25"
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
