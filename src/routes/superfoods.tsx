import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHero } from "@/components/site/Layout";
import { Newsletter } from "@/components/site/Newsletter";
import { ingredients } from "@/lib/brand";
import ingredientsImg from "@/assets/ingredients.jpg";

export const Route = createFileRoute("/superfoods")({
  head: () => ({
    meta: [
      { title: "African Superfoods — Hey! You Wellness" },
      {
        name: "description",
        content:
          "Baobab, millet, tiger nut, moringa, hibiscus, cassava, cocoa and kola nut — the African ingredients behind Hey! You Wellness and why they matter.",
      },
      { property: "og:title", content: "African Superfoods — Hey! You Wellness" },
      {
        property: "og:description",
        content: "An ingredient library of African superfoods, their heritage and their wellness role.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SuperfoodsPage,
});

function SuperfoodsPage() {
  return (
    <Layout>
      <PageHero
        eyebrow="Ingredient library"
        title="African goodness, made modern"
        intro="Every ingredient we build with has been feeding people here for generations. Here is what each one brings."
      />

      <section className="shell pt-16">
        <div className="overflow-hidden rounded-[1.75rem] shadow-lift">
          <img
            src={ingredientsImg}
            alt="Overhead view of baobab powder, moringa, hibiscus, millet, tiger nuts, cocoa, dates and ginger"
            loading="lazy"
            width={1600}
            height={1008}
            className="w-full object-cover"
          />
        </div>
      </section>

      <section className="shell section-y">
        <div className="grid gap-8 md:grid-cols-2">
          {ingredients.map((i) => (
            <article key={i.name} className="rounded-2xl border border-border bg-card p-8 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-leaf/45 hover:shadow-lift">
              <h2 className="display-3">{i.name}</h2>
              <p className="mt-2 eyebrow text-accent">{i.origin}</p>
              <p className="mt-5 text-muted-foreground">{i.heritage}</p>
              <p className="mt-3 text-foreground">{i.wellness}</p>
            </article>
          ))}
        </div>

        <p className="mt-12 max-w-2xl text-sm text-muted-foreground">
          Ingredient descriptions are educational and are not medical advice. Specific product claims will be
          published only where they can be supported.
        </p>
      </section>

      <Newsletter tone="purple" />
    </Layout>
  );
}
