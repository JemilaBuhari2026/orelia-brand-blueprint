import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Layout, PageHero } from "@/components/site/Layout";
import { CtaLink } from "@/components/site/Cta";
import { CartLineRow, OrderTotals } from "@/components/site/CartLines";
import { useCartQuote } from "@/components/site/CartDrawer";
import { useCart } from "@/lib/cart";
import { track, commerceEvents } from "@/lib/analytics";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your bag — Hey! You Wellness" },
      {
        name: "description",
        content: "Review the Hey! You Wellness items in your bag before checkout.",
      },
      { property: "og:title", content: "Your bag — Hey! You Wellness" },
      {
        property: "og:description",
        content: "Review the Hey! You Wellness items in your bag before checkout.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, hydrated } = useCart();
  const { data: quote, isPending } = useCartQuote();

  useEffect(() => {
    track(commerceEvents.cartView, { lines: lines.length });
  }, [lines.length]);

  return (
    <Layout>
      <PageHero
        eyebrow="Your bag"
        title="Everything you've picked"
        intro="Review your items, adjust quantities and continue to checkout."
      />

      <section className="shell section-y">
        {!hydrated ? (
          <p className="text-muted-foreground">Loading your bag…</p>
        ) : lines.length === 0 ? (
          <div className="max-w-xl">
            <h2 className="display-2">Your bag is empty</h2>
            <p className="mt-4 text-muted-foreground">
              Nothing here yet. Explore the range — anything available to buy can be added to your
              bag.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <CtaLink to="/products" size="lg">
                Explore products
              </CtaLink>
              <CtaLink to="/superfoods" variant="secondary" size="lg">
                African superfoods
              </CtaLink>
            </div>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
            <ul>
              {lines.map((line) => (
                <CartLineRow
                  key={`${line.productId}:${line.variantId ?? "base"}`}
                  line={line}
                  quote={quote}
                />
              ))}
            </ul>

            <aside className="h-fit rounded-[1.5rem] border-2 border-cocoa/12 bg-card p-6">
              <h2 className="font-display text-2xl">Order summary</h2>
              <div className="mt-5">
                <OrderTotals quote={quote} />
              </div>
              {quote?.issues.length ? (
                <ul role="alert" className="mt-4 space-y-1 text-sm font-medium text-destructive">
                  {quote.issues.map((issue) => (
                    <li key={issue}>{issue}</li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-6 flex flex-col gap-3">
                <CtaLink to="/checkout" size="lg" disabled={isPending}>
                  Proceed to checkout
                </CtaLink>
                <CtaLink to="/products" variant="secondary">
                  Continue shopping
                </CtaLink>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Delivery is calculated at checkout. Questions? Visit our contact page.
              </p>
            </aside>
          </div>
        )}
      </section>
    </Layout>
  );
}
