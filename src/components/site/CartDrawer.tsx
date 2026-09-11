import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { X } from "lucide-react";
import { CtaLink } from "@/components/site/Cta";
import { CartLineRow, OrderTotals } from "@/components/site/CartLines";
import { useCart } from "@/lib/cart";
import { quoteCart } from "@/lib/checkout.functions";
import { track, commerceEvents } from "@/lib/analytics";

export function useCartQuote() {
  const { lines, hydrated } = useCart();
  const quote = useServerFn(quoteCart);
  return useQuery({
    queryKey: ["cart-quote", lines],
    queryFn: () =>
      quote({
        data: {
          lines: lines.map((l) => ({
            catalogSlug: l.catalogSlug,
            productId: l.productId,
            variantId: l.variantId,
            quantity: l.quantity,
          })),
        },
      }),
    enabled: hydrated && lines.length > 0,
  });
}

export function CartDrawer() {
  const { isOpen, closeCart, lines } = useCart();
  const { data: quote } = useCartQuote();

  useEffect(() => {
    if (!isOpen) return;
    track(commerceEvents.cartView, { lines: lines.length });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart, lines.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label="Close bag"
        onClick={closeCart}
        className="absolute inset-0 bg-cocoa/40 backdrop-blur-[2px]"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-lift motion-safe:animate-in motion-safe:slide-in-from-right motion-safe:duration-300"
      >
        <header className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <h2 className="font-display text-2xl">Your bag</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close bag"
            className="grid size-10 place-items-center rounded-full transition-colors hover:bg-secondary"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5">
          {lines.length === 0 ? (
            <p className="py-10 text-muted-foreground">
              Your bag is empty. Explore the range and add anything that is available to buy.
            </p>
          ) : (
            <ul>
              {lines.map((line) => (
                <CartLineRow
                  key={`${line.productId}:${line.variantId ?? "base"}`}
                  line={line}
                  quote={quote}
                  compact
                />
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 ? (
          <footer className="space-y-4 border-t border-border/60 px-5 py-5">
            <OrderTotals quote={quote} />
            <div className="flex flex-col gap-2">
              <CtaLink to="/checkout" size="lg" onClick={closeCart}>
                Checkout
              </CtaLink>
              <CtaLink to="/cart" variant="secondary" onClick={closeCart}>
                View full bag
              </CtaLink>
            </div>
          </footer>
        ) : (
          <footer className="border-t border-border/60 px-5 py-5">
            <CtaLink to="/products" variant="secondary" onClick={closeCart}>
              Continue shopping
            </CtaLink>
          </footer>
        )}
      </aside>
    </div>
  );
}
