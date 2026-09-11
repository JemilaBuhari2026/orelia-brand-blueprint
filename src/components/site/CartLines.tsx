import { Minus, Plus, Trash2 } from "lucide-react";
import { getProduct } from "@/lib/catalog";
import { formatMoney, useCart, MAX_LINE_QUANTITY, type CartLine } from "@/lib/cart";
import type { CartQuote } from "@/lib/checkout.functions";

export function useQuoteFor(line: CartLine, quote?: CartQuote | null | undefined) {
  return quote?.lines.find(
    (l) => l.productId === line.productId && (l.variantId ?? null) === (line.variantId ?? null),
  );
}

export function CartLineRow({
  line,
  quote,
  compact = false,
}: {
  line: CartLine;
  quote?: CartQuote | null | undefined;
  compact?: boolean;
}) {
  const { setQuantity, removeLine } = useCart();
  const product = getProduct(line.catalogSlug);
  const quoted = useQuoteFor(line, quote);
  const variantName =
    line.variantId && product?.variants?.find((v) => v.id === line.variantId)?.name;
  const unitPrice = formatMoney(quoted?.unitPrice ?? null, quoted?.currency ?? null);
  const lineTotal = formatMoney(quoted?.lineTotal ?? null, quoted?.currency ?? null);
  const name = product?.name ?? "Item";

  return (
    <li className="flex gap-4 border-b border-border/60 py-4 last:border-b-0">
      {product ? (
        <img
          src={product.hero.src}
          alt={product.hero.alt}
          width={160}
          height={200}
          loading="lazy"
          className={compact ? "size-20 rounded-xl object-cover" : "size-24 rounded-2xl object-cover"}
        />
      ) : null}

      <div className="min-w-0 flex-1">
        <p className="font-display text-lg leading-tight text-foreground">{name}</p>
        {variantName ? <p className="text-sm text-muted-foreground">{variantName}</p> : null}
        {unitPrice ? (
          <p className="mt-1 text-sm text-muted-foreground">{unitPrice} each</p>
        ) : null}
        {quoted?.issue ? (
          <p role="alert" className="mt-1 text-sm font-medium text-destructive">
            {quoted.issue}
          </p>
        ) : null}

        <div className="mt-3 flex items-center gap-3">
          <div className="inline-flex items-center rounded-full border-2 border-cocoa/15">
            <button
              type="button"
              onClick={() => setQuantity(line.productId, line.variantId, line.quantity - 1)}
              aria-label={`Decrease quantity of ${name}`}
              className="grid size-9 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary"
            >
              <Minus className="size-4" />
            </button>
            <span aria-live="polite" className="min-w-8 text-center text-sm font-semibold">
              {line.quantity}
            </span>
            <button
              type="button"
              disabled={line.quantity >= MAX_LINE_QUANTITY}
              onClick={() => setQuantity(line.productId, line.variantId, line.quantity + 1)}
              aria-label={`Increase quantity of ${name}`}
              className="grid size-9 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary disabled:opacity-40"
            >
              <Plus className="size-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeLine(line.productId, line.variantId)}
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash2 className="size-4" aria-hidden />
            <span>Remove</span>
            <span className="sr-only">{name} from your bag</span>
          </button>
        </div>
      </div>

      {lineTotal ? (
        <p className="shrink-0 text-sm font-semibold text-foreground">{lineTotal}</p>
      ) : null}
    </li>
  );
}

export function OrderTotals({ quote }: { quote?: CartQuote | null | undefined }) {
  const subtotal = formatMoney(quote?.subtotal ?? null, quote?.currency ?? null);
  const total = formatMoney(quote?.total ?? null, quote?.currency ?? null);

  return (
    <dl className="space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <dt className="text-muted-foreground">Subtotal</dt>
        <dd className="font-semibold text-foreground">{subtotal ?? "—"}</dd>
      </div>
      <div className="flex items-center justify-between">
        <dt className="text-muted-foreground">Delivery</dt>
        <dd className="text-muted-foreground">Calculated at checkout</dd>
      </div>
      <div className="flex items-center justify-between">
        <dt className="text-muted-foreground">Tax</dt>
        <dd className="text-muted-foreground">Not applicable yet</dd>
      </div>
      <div className="flex items-center justify-between border-t border-border/60 pt-3 text-base">
        <dt className="font-semibold text-foreground">Total</dt>
        <dd className="font-semibold text-foreground">{total ?? "—"}</dd>
      </div>
    </dl>
  );
}
