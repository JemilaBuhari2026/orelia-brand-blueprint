import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { Newsletter } from "@/components/site/Newsletter";
import { articles } from "@/lib/brand";

export const Route = createFileRoute("/journal/$slug")({
  loader: ({ params }) => {
    const article = articles.find((a) => a.slug === params.slug);
    if (!article) throw notFound();
    return article;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — Hey! You Wellness` },
          { name: "description", content: loaderData.excerpt },
          { property: "og:title", content: loaderData.title },
          { property: "og:description", content: loaderData.excerpt },
          { property: "og:type", content: "article" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [],
    scripts: loaderData
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: loaderData.title,
              description: loaderData.excerpt,
              articleSection: loaderData.cluster,
              inLanguage: "en",
              publisher: { "@type": "Organization", name: "Hey! You Wellness" },
            }),
          },
        ]
      : [],
  }),
  component: ArticlePage,
});

function ArticlePage() {
  const article = Route.useLoaderData();
  const more = articles.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <Layout>
      <article className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
        <Link to="/journal" className="inline-flex items-center gap-2 text-sm font-medium text-primary">
          <ArrowLeft className="size-4" /> Wellness journal
        </Link>
        <p className="eyebrow mt-10 text-accent">{article.cluster}</p>
        <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">{article.title}</h1>
        <p className="mt-4 text-sm text-muted-foreground">{article.readingTime}</p>
        <div className="mt-10 space-y-6 text-lg leading-relaxed text-foreground/85">
          {article.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <p className="mt-12 rounded-2xl bg-secondary p-5 text-sm text-muted-foreground">
          General wellness information, not medical advice. Speak to a qualified professional about your own
          health.
        </p>
      </article>

      <section className="mx-auto max-w-5xl px-5 pb-20 lg:px-8">
        <h2 className="font-display text-2xl">Keep reading</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {more.map((a) => (
            <Link
              key={a.slug}
              to="/journal/$slug"
              params={{ slug: a.slug }}
              className="rounded-3xl border border-border bg-card p-7 transition-colors hover:border-primary/50"
            >
              <p className="eyebrow text-accent">{a.cluster}</p>
              <h3 className="mt-3 font-display text-xl leading-snug">{a.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      <Newsletter />
    </Layout>
  );
}
