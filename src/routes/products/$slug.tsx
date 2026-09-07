import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { Newsletter } from "@/components/site/Newsletter";
import { products } from "@/lib/brand";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = products.find((p) => p.slug === params.slug);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Hey! You Wellness` },
          { name: "description", content: loaderData.proposition },
          { property: "og:title", content: `${loaderData.name} — Hey! You Wellness` },
          { property: "og:description", content: loaderData.proposition },
          { property: "og:type", content: "product" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [],
    scripts: loaderData
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: loaderData.name,
              description: loaderData.proposition,
              category: loaderData.family,
              brand: { "@type": "Brand", name: "Hey! You Wellness" },
            }),
          },
        ]
      : [],
  }),
  component: ProductPage,
});

function ProductPage() {
  const product = Route.useLoaderData();
  const others = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <Layout>
      <section className="shell pt-10">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm font-medium text-primary">
          <ArrowLeft className="size-4" /> All products
        </Link>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-12 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="overflow-hidden rounded-[1.75rem] shadow-lift">
          <img
            src={product.image}
            alt={product.name}
            width={1024}
            height={1024}
            className="aspect-[4/5] w-full object-cover"
          />
        </div>

        <div>
          <p className="eyebrow text-accent">
            {product.family} · {product.role}
          </p>
          <h1 className="mt-3 display-1">{product.name}</h1>
          <p className="mt-5 lede text-muted-foreground">{product.proposition}</p>

          <div className="mt-10 space-y-8">
            <div>
              <h2 className="eyebrow text-primary">How it tastes</h2>
              <p className="mt-3 text-foreground">{product.taste}</p>
            </div>
            <div>
              <h2 className="eyebrow text-primary">Why it's here</h2>
              <p className="mt-3 text-foreground">{product.benefit}</p>
            </div>
            <div>
              <h2 className="eyebrow text-primary">Hero ingredients</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {product.ingredients.map((i) => (
                  <li key={i} className="rounded-full bg-secondary px-4 py-1.5 text-sm font-medium">
                    {i}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="eyebrow text-primary">How to enjoy it</h2>
              <ul className="mt-3 space-y-2">
                {product.enjoy.map((e) => (
                  <li key={e} className="flex gap-3 text-foreground">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-10 rounded-2xl bg-secondary p-5 text-sm text-muted-foreground">
            {product.status === "Future concept"
              ? "A concept in development. Nutrition information and availability will follow."
              : "In development. Full nutrition information, pricing and availability will be published before launch."}
          </p>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="shell-narrow section-y">
          <p className="eyebrow text-primary-foreground/70">Ingredient story</p>
          <p className="mt-5 font-display text-2xl leading-snug sm:text-3xl">{product.story}</p>
        </div>
      </section>

      <section className="shell section-y">
        <h2 className="display-2">More from the range</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {others.map((p) => (
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
                <h3 className="font-display text-xl">{p.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.family}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Newsletter />
    </Layout>
  );
}
