import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHero } from "@/components/site/Layout";
import { Newsletter } from "@/components/site/Newsletter";
import { Reveal } from "@/components/site/Reveal";
import { Parallax } from "@/components/site/Motion";
import {
  HeyYouBlob,
  HeyYouBurst,
  HeyYouFloatingDecoration,
  HeyYouSpark,
} from "@/components/site/Decor";
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

      <section className="shell relative pt-16">
        <HeyYouBlob tone="lime" shape="c" opacity={0.35} blur className="-left-20 -top-10 size-72" />
        <Parallax speed={0.05} className="relative">
          <Reveal variant="mask" className="overflow-hidden rounded-[1.75rem] shadow-editorial">
            <img
              src={ingredientsImg}
              alt="Overhead view of baobab powder, moringa, hibiscus, millet, tiger nuts, cocoa, dates and ginger"
              loading="lazy"
              width={1600}
              height={1008}
              className="w-full object-cover"
            />
          </Reveal>
        </Parallax>
        <HeyYouFloatingDecoration className="-right-2 top-4 hidden md:block" duration={12}>
          <HeyYouBurst tone="orange" className="size-16" />
        </HeyYouFloatingDecoration>
      </section>

      <section className="shell section-y">
        <div className="grid gap-8 md:grid-cols-2">
          {ingredients.map((i, index) => (
            <Reveal key={i.name} delay={(index % 2) * 90} className="flex">
              <article className="group relative w-full overflow-hidden rounded-[1.6rem] border-2 border-border bg-card p-8 transition-[border-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-lime hover:shadow-lift motion-safe:hover:-translate-y-1.5">
                <HeyYouBlob
                  tone={index % 3 === 0 ? "lime" : index % 3 === 1 ? "orange" : "purple"}
                  shape={index % 2 ? "b" : "a"}
                  opacity={0.18}
                  blur
                  className="-right-14 -top-14 size-40 transition-transform duration-700 group-hover:translate-x-2 group-hover:translate-y-1"
                />
                <div className="relative">
                  <h2 className="display-3">{i.name}</h2>
                  <p className="mt-2 eyebrow text-accent">{i.origin}</p>
                  <p className="mt-5 text-muted-foreground">{i.heritage}</p>
                  <p className="mt-3 text-foreground">{i.wellness}</p>
                </div>
                <HeyYouSpark
                  tone="gold"
                  className="absolute bottom-5 right-6 h-8 w-6 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
                />
              </article>
            </Reveal>
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
