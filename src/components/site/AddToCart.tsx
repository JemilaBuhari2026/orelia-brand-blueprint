import { useState } from "react";
import { toast } from "sonner";
import { CtaButton, CtaLink } from "@/components/site/Cta";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/catalog";
import { productPurchasability, variantPurchasable } from "@/lib/purchasable";
import { formatMoney } from "@/lib/cart";
import { cn } from "@/lib/utils";

/**
 * Renders a purchase action ONLY for products that are genuinely purchasable.
 * Everything else keeps its existing discovery experience — no fake buttons.
 */
export function AddToCart({ product }: { product: Product }) {
  const { commerce, purchasable, variants, requiresVariantChoice } =
    productPurchasability(product);
  const { addLine } = useCart();
  const [variantId, setVariantId] = useState<string | null>(
    commerce.defaultVariantId ?? (variants.length === 1 ? variants[0]!.id : null),
  );
  const [error, setError] = useState<string | null>(null);

  if (!purchasable) return null;

  const selected = variants.find((v) => v.id === variantId);
  const price = selected
    ? formatMoney(selected.price.amount, selected.price.currency)
    : formatMoney(commerce.price.amount, commerce.price.currency);

  const handleAdd = () => {
    if (requiresVariantChoice && !variantId) {
      setError("Please choose an option before adding this to your bag.");
      return;
    }
    if (selected && !variantPurchasable(selected)) {
      setError("That option is not available right now. Please choose another.");
      return;
    }
    setError(null);
    addLine({
      catalogSlug: product.slug,
      productId: commerce.catalogSlug,
      variantId: selected?.id ?? null,
      unitPriceSnapshot: selected?.price.amount ?? commerce.price.amount,
      currencySnapshot: selected?.price.currency ?? commerce.price.currency,
    });
    toast.success(`${product.name} added to your bag`);
  };

  return (
    <div className="mt-8 rounded-[1.5rem] border-2 border-cocoa/12 bg-card p-5">
      {price ? <p className="display-3 text-foreground">{price}</p> : null}

      {variants.length > 1 ? (
        <fieldset className="mt-4">
          <legend className="eyebrow text-primary">Choose an option</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {variants.map((v) => {
              const available = variantPurchasable(v);
              return (
                <button
                  key={v.id}
                  type="button"
                  disabled={!available}
                  aria-pressed={variantId === v.id}
                  onClick={() => {
                    setVariantId(v.id);
                    setError(null);
                  }}
                  className={cn(
                    "min-h-11 rounded-full border-2 px-4 text-sm font-medium transition-colors",
                    variantId === v.id
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-cocoa/15 text-muted-foreground hover:border-primary",
                    !available && "cursor-not-allowed opacity-50",
                  )}
                >
                  {v.name}
                  {!available ? " · unavailable" : ""}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {error ? (
        <p role="alert" className="mt-3 text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <CtaButton type="button" onClick={handleAdd} size="lg">
          Add to bag
        </CtaButton>
        <CtaLink to="/cart" variant="secondary" size="lg">
          View bag
        </CtaLink>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">Delivery calculated at checkout.</p>
    </div>
  );
}
