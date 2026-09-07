import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Layout, PageHero } from "@/components/site/Layout";
import { Newsletter } from "@/components/site/Newsletter";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { CtaButton } from "@/components/site/Cta";
import { FilterPanel, type FilterGroup } from "@/components/site/ProductFilters";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  catalogueStatuses,
  filterProducts,
  ingredientFilters,
  productCategories,
  productFamilies,
  sortOptions,
  statusLabels,
  visibleProducts,
  type SortKey,
} from "@/lib/catalog";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Products — Hey! You Wellness" },
      {
        name: "description",
        content:
          "Furafrost, Mood Bars, Crunch Sticks, Cocoa Boost, Hey! You Superfoods and Naija Cola — search and explore the Hey! You Wellness product family.",
      },
      { property: "og:title", content: "Products — Hey! You Wellness" },
      {
        property: "og:description",
        content: "The growing family of African wellness foods from Hey! You Wellness.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductsPage,
});

type Selection = {
  families: string[];
  categories: string[];
  statuses: string[];
  ingredients: string[];
};

const emptySelection: Selection = {
  families: [],
  categories: [],
  statuses: [],
  ingredients: [],
};

function ProductsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");
  const [selected, setSelected] = useState<Selection>(emptySelection);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const groups: FilterGroup[] = useMemo(
    () => [
      {
        id: "families",
        legend: "Product family",
        options: productFamilies
          .filter((f) => visibleProducts.some((p) => p.familySlug === f.slug))
          .map((f) => ({ value: f.slug, label: f.name })),
      },
      {
        id: "categories",
        legend: "Category",
        options: productCategories
          .filter((c) => visibleProducts.some((p) => p.category === c))
          .map((c) => ({ value: c, label: c })),
      },
      {
        id: "statuses",
        legend: "Availability",
        options: catalogueStatuses.map((s) => ({ value: s, label: statusLabels[s] })),
      },
      {
        id: "ingredients",
        legend: "Ingredient",
        options: ingredientFilters.map((i) => ({ value: i, label: i })),
      },
    ],
    [],
  );

  const results = useMemo(
    () =>
      filterProducts({
        search,
        families: selected.families,
        categories: selected.categories,
        statuses: selected.statuses,
        ingredients: selected.ingredients,
        sort,
      }),
    [search, selected, sort],
  );

  const activeCount = Object.values(selected).reduce((n, list) => n + list.length, 0);

  const toggle = (groupId: string, value: string) =>
    setSelected((prev) => {
      const key = groupId as keyof Selection;
      const list = prev[key];
      return {
        ...prev,
        [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
      };
    });

  const clearAll = () => {
    setSelected(emptySelection);
    setSearch("");
  };

  return (
    <Layout>
      <PageHero
        eyebrow="The range"
        title="Meet the good stuff"
        intro="Each product answers a real moment in the day — a slow morning, a long afternoon, a table full of people."
      />

      <section className="shell pt-12">
        <h2 className="sr-only">Product families</h2>
        <ul className="flex flex-wrap gap-2">
          {productFamilies
            .filter((f) => visibleProducts.some((p) => p.familySlug === f.slug))
            .map((f) => {
              const active = (selected.families ?? []).includes(f.slug);
              return (
                <li key={f.slug}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggle("families", f.slug)}
                    className={
                      active
                        ? "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                        : "rounded-full border border-cocoa/20 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-cocoa/40 hover:bg-secondary"
                    }
                  >
                    {f.name}
                  </button>
                </li>
              );
            })}
        </ul>
      </section>

      <section className="shell pb-16 pt-8 lg:pb-24">
        <div className="grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-14">
          <aside className="hidden lg:block">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg">Filter</h2>
              {activeCount > 0 ? (
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Clear all
                </button>
              ) : null}
            </div>
            <FilterPanel className="mt-6" groups={groups} selected={selected} onToggle={toggle} />
          </aside>

          <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search
                  aria-hidden
                  className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <label htmlFor="product-search" className="sr-only">
                  Search products
                </label>
                <input
                  id="product-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, family or ingredient"
                  className="min-h-12 w-full rounded-full border border-cocoa/20 bg-background pl-11 pr-11 text-sm [&::-webkit-search-cancel-button]:appearance-none text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2"
                />
                {search ? (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <X className="size-4" />
                    <span className="sr-only">Clear search</span>
                  </button>
                ) : null}
              </div>

              <div className="flex items-center gap-3">
                <label htmlFor="product-sort" className="sr-only">
                  Sort products
                </label>
                <select
                  id="product-sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="min-h-12 rounded-full border border-cocoa/20 bg-background px-4 text-sm font-medium text-foreground focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>

                <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
                  <SheetTrigger asChild>
                    <CtaButton variant="secondary" className="lg:hidden">
                      <SlidersHorizontal className="size-4" />
                      Filter{activeCount ? ` (${activeCount})` : ""}
                    </CtaButton>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl">
                    <SheetHeader>
                      <SheetTitle className="font-display text-xl">Filter products</SheetTitle>
                    </SheetHeader>
                    <div className="px-4 pb-8">
                      <FilterPanel groups={groups} selected={selected} onToggle={toggle} />
                      <div className="mt-8 flex gap-3">
                        <CtaButton variant="secondary" className="flex-1" onClick={clearAll}>
                          Clear all
                        </CtaButton>
                        <CtaButton className="flex-1" onClick={() => setDrawerOpen(false)}>
                          Show {results.length} product{results.length === 1 ? "" : "s"}
                        </CtaButton>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            <p aria-live="polite" className="mt-5 text-sm text-muted-foreground">
              {results.length} product{results.length === 1 ? "" : "s"}
              {activeCount || search ? " match your search" : " in the family"}
            </p>

            {results.length ? (
              <div className="mt-8 grid gap-10 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((p, i) => (
                  <Reveal key={p.slug} delay={i * 60}>
                    <ProductCard product={p} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="mt-10 rounded-3xl bg-secondary/70 p-10 text-center">
                <p className="font-display text-2xl">No Hey! You products match that yet.</p>
                <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                  Try a different ingredient or clear your filters — the family is still growing.
                </p>
                <CtaButton className="mt-6" onClick={clearAll}>
                  Clear search and filters
                </CtaButton>
              </div>
            )}

            <p className="mt-12 max-w-2xl text-sm text-muted-foreground">
              Products are shown for information while the range is in development. Prices,
              nutrition panels and online ordering will be added once formulations and packaging are
              final.{" "}
              <Link to="/contact" className="font-semibold text-primary underline-offset-4 hover:underline">
                Talk to us
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <Newsletter tone="purple" />
    </Layout>
  );
}
