import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHero } from "@/components/site/Layout";
import { Newsletter } from "@/components/site/Newsletter";
import { ArticleCard } from "@/components/site/ArticleCard";
import { Reveal } from "@/components/site/Reveal";
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

      <section className="shell-narrow section-y">
        <div className="grid gap-6 md:grid-cols-2">
          {articles.map((a, i) => (
            <Reveal key={a.slug} delay={i * 70} className="flex">
              <ArticleCard article={a} className="w-full" />
            </Reveal>
          ))}
        </div>
      </section>

      <Newsletter />
    </Layout>
  );
}
