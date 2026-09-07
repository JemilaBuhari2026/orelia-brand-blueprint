import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { Newsletter } from "@/components/site/Newsletter";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import {
  getProduct,
  getProductFaqs,
  getRelatedProducts,
  statusLabels,
} from "@/lib/catalog";
import { ingredients as ingredientLibrary } from "@/lib/brand";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: loaderData.seoTitle },
          { name: "description", content: loaderData.seoDescription },
          { property: "og:title", content: loaderData.seoTitle },
          { property: "og:description", content: loaderData.seoDescription },
          { property: "og:type", content: "product" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Unavailable — Hey! You Wellness" }, { name: "robots", content: "noindex" }],
    scripts: loaderData
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: loaderData.name,
              description: loaderData.shortDescription,
              category: loaderData.category,
              brand: { "@type": "Brand", name: "Hey! You Wellness" },
            }),
          },
        ]
      : [],
  }),
  component: ProductPage,
});

function Section({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="eyebrow text-primary">{eyebrow}</h2>
      <div className="mt-3 text-foreground">{children}</div>
    </div>
  );
}

function ProductPage() {
  const product = Route.useLoaderData();
  const related = getRelatedProducts(product);
  const faqs = getProductFaqs(product);
  const africanIngredients = ingredientLibrary.filter((i) =>
    product.africanIngredients.includes(i.name),
  );

  return (
    <Layout>
      <nav aria-label="Breadcrumb" className="shell pt-8">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          <ChevronRight aria-hidden className="size-3.5" />
          <li>
            <Link to="/products" className="hover:text-primary">
              Products
            </Link>
          </li>
          <ChevronRight aria-hidden className="size-3.5" />
          <li aria-current="page" className="font-medium text-foreground">
            {product.name}
          </li>
        </ol>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-10 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="overflow-hidden rounded-[1.75rem] shadow-lift">
          <img
            src={product.hero.src}
            alt={product.hero.alt}
            width={1024}
            height={1280}
            className="aspect-[4/5] w-full object-cover"
          />
        </div>

        <div>
          <p className="eyebrow text-accent">
            {product.family} · {product.category}
          </p>
          <h1 className="mt-3 display-1">{product.name}</h1>
          <p className="mt-4">
            <span className="inline-flex rounded-full bg-secondary px-3 py-1 meta font-semibold text-foreground">
              {statusLabels[product.status]}
            </span>
          </p>
          <p className="mt-5 lede text-muted-foreground">{product.shortDescription}</p>
          {product.longDescription ? (
            <p className="mt-4 text-muted-foreground">{product.longDescription}</p>
          ) : null}

          <div className="mt-10 space-y-8">
            <Section eyebrow="How it tastes">
              <p>{product.tasteProfile}</p>
            </Section>

            <Section eyebrow="Hero ingredient">
              <p>{product.heroIngredient}</p>
            </Section>

            <Section eyebrow="Why it's here">
              <p>{product.wellnessPositioning}</p>
            </Section>

            <Section eyebrow="Ingredients">
              <ul className="flex flex-wrap gap-2">
                {product.ingredients.map((i) => (
                  <li key={i} className="rounded-full bg-secondary px-4 py-1.5 text-sm font-medium">
                    {i}
                  </li>
                ))}
              </ul>
            </Section>

            {product.variants?.length ? (
              <Section eyebrow="Variants">
                <ul className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <li key={v.id} className="rounded-full bg-secondary px-4 py-1.5 text-sm font-medium">
                      {v.name} · {statusLabels[v.status]}
                    </li>
                  ))}
                </ul>
              </Section>
            ) : null}

            {product.size ? (
              <Section eyebrow="Size">
                <p>{product.size}</p>
              </Section>
            ) : null}

            <Section eyebrow="How to enjoy it">
              <ul className="space-y-2">
                {product.howToEnjoy.map((e) => (
                  <li key={e} className="flex gap-3">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                    {e}
                  </li>
                ))}
              </ul>
            </Section>
          </div>

          <p className="mt-10 rounded-2xl bg-secondary p-5 text-sm text-muted-foreground">
            {product.status === "concept"
              ? "A concept in development. Nutrition information and availability will follow."
              : "In development. Full nutrition information, pricing and availability will be published before launch."}
          </p>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="shell-narrow section-y">
          <p className="eyebrow text-primary-foreground/70">Ingredient story</p>
          <p className="mt-5 font-display text-2xl leading-snug sm:text-3xl">
            {product.ingredientStory}
          </p>
        </div>
      </section>

      {africanIngredients.length ? (
        <section className="shell section-y">
          <h2 className="display-2">The African ingredients inside</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {africanIngredients.map((i) => (
              <Reveal key={i.name} className="rounded-3xl bg-card p-6 shadow-soft">
                <h3 className="font-display text-xl">{i.name}</h3>
                <p className="mt-1 meta text-accent">{i.origin}</p>
                <p className="mt-3 text-sm text-muted-foreground">{i.heritage}</p>
                <p className="mt-2 text-sm text-muted-foreground">{i.wellness}</p>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
            Ingredient background is shared for context. It is not a health claim about this
            product.
          </p>
        </section>
      ) : null}

      {faqs.length ? (
        <section className="bg-secondary/60">
          <div className="shell-narrow section-y">
            <h2 className="display-2">Questions</h2>
            <dl className="mt-8 space-y-6">
              {faqs.map((f) => (
                <div key={f.question} className="rounded-2xl bg-background p-6 shadow-soft">
                  <dt className="font-display text-lg">{f.question}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section className="shell section-y">
          <h2 className="display-2">More from the Hey! You family</h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i * 70}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      <Newsletter />
    </Layout>
  );
}
