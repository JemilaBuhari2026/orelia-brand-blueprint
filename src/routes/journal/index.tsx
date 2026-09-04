import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout, PageHero } from "@/components/site/Layout";
import { Newsletter } from "@/components/site/Newsletter";
import { articles } from "@/lib/brand";

export const Route = createFileRoute("/journal/")({
  head: () => ({
    meta: [
      { title: "Wellness Journal — Hey! You Wellness" },
      {
        name: "description",
        content:
          "Plain-language writing on gut health, the food and mood connection, African superfoods, healthy snacking and recipes.",
      },
      { property: "og:title", content: "Wellness Journal — Hey! You Wellness" },
      {
        property: "og:description",
        content: "Gut health, food and mood, African superfoods and everyday snacking — explained simply.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JournalPage,
});

function JournalPage() {
  return (
    <Layout>
      <PageHero
        eyebrow="Wellness journal"
        title="Useful, honest, jargon-free"
        intro="Gut health, the food and mood connection, African superfoods, snacking and recipes."
      />

      <section className="mx-auto max-w-5xl px-5 py-20 lg:px-8">
        <div className="grid gap-6">
          {articles.map((a) => (
            <Link
              key={a.slug}
              to="/journal/$slug"
              params={{ slug: a.slug }}
              className="rounded-3xl border border-border bg-card p-8 transition-colors hover:border-primary/50"
            >
              <p className="eyebrow text-accent">{a.cluster}</p>
              <h2 className="mt-3 font-display text-3xl leading-snug">{a.title}</h2>
              <p className="mt-3 text-muted-foreground">{a.excerpt}</p>
              <p className="mt-5 text-xs text-muted-foreground">{a.readingTime}</p>
            </Link>
          ))}
        </div>
      </section>

      <Newsletter />
    </Layout>
  );
}
