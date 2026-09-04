import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHero } from "@/components/site/Layout";
import { Newsletter } from "@/components/site/Newsletter";
import { values } from "@/lib/brand";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Our Story — Hey! You Wellness" },
      {
        name: "description",
        content:
          "Purpose, vision, mission and values behind Hey! You Wellness — a premium African wellness food brand built on joy, gut health and heritage ingredients.",
      },
      { property: "og:title", content: "Our Story — Hey! You Wellness" },
      {
        property: "og:description",
        content: "Why Hey! You Wellness exists, what it stands for and where it is going.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StoryPage,
});

function StoryPage() {
  return (
    <Layout>
      <PageHero
        eyebrow="Our story"
        title="Wellness should not feel like punishment."
        intro="It should feel like something you want to come back to."
      />

      <section className="mx-auto max-w-4xl px-5 py-20 lg:px-8">
        <div className="space-y-14">
          <div>
            <p className="eyebrow text-primary">Purpose</p>
            <p className="mt-4 font-display text-2xl leading-snug sm:text-3xl">
              To make nourishing, feel-good choices easier and more enjoyable through thoughtfully developed foods
              inspired by African ingredients and modern wellness needs.
            </p>
          </div>

          <div className="grid gap-10 border-t border-border pt-14 sm:grid-cols-2">
            <div>
              <p className="eyebrow text-primary">Vision</p>
              <p className="mt-4 text-muted-foreground">
                To become a leading African wellness food brand with global relevance — known for beautiful
                products, enjoyable nutrition, credible wellness education and meaningful impact.
              </p>
            </div>
            <div>
              <p className="eyebrow text-primary">Mission</p>
              <p className="mt-4 text-muted-foreground">
                Create delicious, accessible and premium wellness foods that connect nourishment, gut health,
                mood, everyday wellbeing and African food heritage.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <p className="eyebrow text-primary">What we hold to</p>
          <h2 className="mt-3 font-display text-4xl">Our values</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="rounded-3xl bg-card p-7">
                <h3 className="font-display text-xl leading-snug">{v.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-20 lg:px-8">
        <p className="eyebrow text-primary">Founder story</p>
        <h2 className="mt-3 font-display text-4xl">Where this began</h2>
        <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted-foreground">
          <p>
            Hey! You Wellness started with a frustration: wellness food in this market either tastes like a
            compromise or looks like it belongs in a pharmacy. Meanwhile the ingredients the rest of the world
            calls superfoods are sold on the roadside here every single day.
          </p>
          <p>
            The brand is an attempt to close that gap — to build food good enough that people choose it for the
            taste first, and feel better for it second.
          </p>
          <p className="text-sm italic">
            This section is a placeholder written from the brand strategy. Send us your own founder story and it
            will be swapped in word for word.
          </p>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center lg:px-8">
          <p className="eyebrow text-primary-foreground/70">Brand promise</p>
          <p className="mt-5 font-display text-3xl leading-snug sm:text-4xl">
            Hey! You should be able to enjoy taking care of yourself.
          </p>
        </div>
      </section>

      <Newsletter />
    </Layout>
  );
}
