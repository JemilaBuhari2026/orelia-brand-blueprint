/**
 * Hey! You Wellness — server-side cart validation & order-ready checkout.
 *
 * SECURITY: client prices, totals, inventory and payment state are never
 * trusted. Every commercial value below is read from the database with the
 * publishable (anon) key, so only rows explicitly marked publicly visible and
 * live can ever be quoted. No prices, tax or shipping values are invented.
 */
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

/* ------------------------------------------------------------------ */
/* Schemas                                                             */
/* ------------------------------------------------------------------ */

const MAX_QUANTITY = 20;

const lineSchema = z.object({
  catalogSlug: z.string().trim().min(1).max(120),
  productId: z.string().trim().min(1).max(64),
  variantId: z.string().trim().min(1).max(64).nullable().optional(),
  quantity: z
    .number()
    .int("Quantity must be a whole number.")
    .min(1, "Quantity must be at least 1.")
    .max(MAX_QUANTITY, `Quantity cannot be more than ${MAX_QUANTITY}.`),
});

const cartSchema = z.object({
  lines: z.array(lineSchema).max(50, "That is too many items for one order."),
});

const phonePattern = /^[0-9+()\-\s]{7,20}$/;

const checkoutSchema = cartSchema.extend({
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .email("Please enter a valid email address, for example name@example.com.")
    .max(255),
  phone: z
    .string()
    .trim()
    .min(1, "Please enter a phone number we can reach you on.")
    .regex(phonePattern, "Please enter a valid phone number, for example 0801 234 5678.")
    .max(40),
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(120, "That name is too long."),
  country: z.string().trim().min(2, "Please choose a country.").max(80),
  state: z.string().trim().min(1, "Please enter your state or region.").max(80),
  city: z.string().trim().min(1, "Please enter your city or town.").max(80),
  address: z
    .string()
    .trim()
    .min(6, "Please enter your full delivery address.")
    .max(400, "That address is too long."),
  deliveryNotes: z.string().trim().max(500).optional().or(z.literal("")),
  /** Guards against duplicate submissions from repeated taps. */
  idempotencyKey: z.string().trim().min(8).max(64),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CartLineInput = z.infer<typeof lineSchema>;

export type QuotedLine = {
  catalogSlug: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  /** Trusted values from the database; null when nothing real is configured. */
  unitPrice: number | null;
  currency: string | null;
  lineTotal: number | null;
  purchasable: boolean;
  /** Specific, customer-readable reason when the line cannot be bought. */
  issue: string | null;
};

export type CartQuote = {
  lines: QuotedLine[];
  currency: string | null;
  subtotal: number | null;
  /** Null means "not configured yet" — never shown as a fake number. */
  shippingTotal: number | null;
  taxTotal: number | null;
  discountTotal: number | null;
  total: number | null;
  purchasable: boolean;
  issues: string[];
};

/* ------------------------------------------------------------------ */
/* Anonymous data client                                               */
/* ------------------------------------------------------------------ */

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

/* ------------------------------------------------------------------ */
/* Quoting                                                             */
/* ------------------------------------------------------------------ */

async function quote(lines: CartLineInput[]): Promise<CartQuote> {
  const empty: CartQuote = {
    lines: [],
    currency: null,
    subtotal: null,
    shippingTotal: null,
    taxTotal: null,
    discountTotal: null,
    total: null,
    purchasable: false,
    issues: [],
  };
  if (lines.length === 0) return empty;

  const client = publicClient();
  const slugs = [...new Set(lines.map((l) => l.catalogSlug))];
  const variantIds = lines.map((l) => l.variantId).filter((v): v is string => Boolean(v));

  const [{ data: products }, { data: variants }] = await Promise.all([
    client
      .from("commerce_products")
      .select("id, catalog_slug, sellable, commerce_status, publicly_visible, currency, base_price")
      .in("catalog_slug", slugs),
    variantIds.length
      ? client
          .from("product_variants")
          .select(
            "id, product_id, name, publicly_visible, currency, price, availability, inventory_tracked, inventory_quantity, preorder",
          )
          .in("id", variantIds)
      : Promise.resolve({ data: [] as never[] }),
  ]);

  const quoted: QuotedLine[] = lines.map((line) => {
    const base: QuotedLine = {
      catalogSlug: line.catalogSlug,
      productId: line.productId,
      variantId: line.variantId ?? null,
      quantity: line.quantity,
      unitPrice: null,
      currency: null,
      lineTotal: null,
      purchasable: false,
      issue: null,
    };

    const product = (products ?? []).find((p) => p.catalog_slug === line.catalogSlug);
    if (!product || !product.publicly_visible) {
      return { ...base, issue: "This product is no longer available." };
    }
    if (!product.sellable || product.commerce_status !== "live") {
      return { ...base, issue: "This product is not on sale yet." };
    }

    let unitPrice = product.base_price == null ? null : Number(product.base_price);
    let currency = product.currency ?? null;

    if (line.variantId) {
      const variant = (variants ?? []).find((v) => v.id === line.variantId);
      if (!variant || variant.product_id !== product.id || !variant.publicly_visible) {
        return { ...base, issue: "The option you chose is no longer available." };
      }
      if (variant.availability === "out_of_stock" || variant.availability === "discontinued") {
        return { ...base, issue: "The option you chose is out of stock." };
      }
      if (
        variant.inventory_tracked &&
        !variant.preorder &&
        (variant.inventory_quantity ?? 0) < line.quantity
      ) {
        return {
          ...base,
          issue: `Only ${variant.inventory_quantity ?? 0} left of this option. Please reduce the quantity.`,
        };
      }
      unitPrice = variant.price == null ? unitPrice : Number(variant.price);
      currency = variant.currency ?? currency;
    }

    if (unitPrice == null || !currency) {
      return { ...base, issue: "Pricing for this product is not published yet." };
    }

    return {
      ...base,
      unitPrice,
      currency,
      lineTotal: Number((unitPrice * line.quantity).toFixed(2)),
      purchasable: true,
    };
  });

  const buyable = quoted.filter((l) => l.purchasable);
  const currencies = [...new Set(buyable.map((l) => l.currency))];
  const issues = quoted.flatMap((l) => (l.issue ? [l.issue] : []));

  if (currencies.length > 1) {
    issues.push("Your basket mixes different currencies. Please check out one currency at a time.");
  }

  const currency = currencies.length === 1 ? currencies[0]! : null;
  const subtotal =
    buyable.length && currency
      ? Number(buyable.reduce((sum, l) => sum + (l.lineTotal ?? 0), 0).toFixed(2))
      : null;

  return {
    lines: quoted,
    currency,
    subtotal,
    // Shipping and tax are not configured. Nothing is invented here.
    shippingTotal: null,
    taxTotal: null,
    discountTotal: null,
    total: subtotal,
    purchasable: buyable.length === quoted.length && quoted.length > 0 && currencies.length === 1,
    issues,
  };
}

/** Trusted cart pricing/validation. Safe to call from public pages. */
export const quoteCart = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => cartSchema.parse(data))
  .handler(async ({ data }) => quote(data.lines));

/* ------------------------------------------------------------------ */
/* Order-ready checkout                                                */
/* ------------------------------------------------------------------ */

export type CheckoutResult =
  | {
      status: "invalid_cart";
      message: string;
      quote: CartQuote;
    }
  | {
      status: "payment_not_configured";
      message: string;
      reference: string;
      quote: CartQuote;
    }
  | {
      status: "payment_redirect";
      url: string;
      reference: string;
    };

function orderReference(idempotencyKey: string): string {
  // Deterministic per submission, so repeated taps map to one reference.
  let hash = 0;
  for (const char of idempotencyKey) {
    hash = (hash * 31 + char.charCodeAt(0)) % 0xffffffff;
  }
  return `HY-${hash.toString(36).toUpperCase().padStart(7, "0").slice(0, 7)}`;
}

/**
 * Validates contact, delivery and every commercial value server-side, then
 * hands off to the payment provider abstraction. No payment provider is
 * configured yet, so no order is created and no payment is ever faked.
 */
export const submitCheckout = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => checkoutSchema.parse(data))
  .handler(async ({ data }): Promise<CheckoutResult> => {
    const cartQuote = await quote(data.lines);

    if (!cartQuote.purchasable || cartQuote.total == null) {
      return {
        status: "invalid_cart",
        message:
          cartQuote.issues[0] ??
          "Your basket cannot be checked out yet. Please review the items in it.",
        quote: cartQuote,
      };
    }

    const { getPaymentProvider } = await import("@/lib/payments");
    const provider = getPaymentProvider();
    const reference = orderReference(data.idempotencyKey);

    const intent = await provider.createIntent({
      amount: cartQuote.total,
      currency: cartQuote.currency!,
      idempotencyKey: data.idempotencyKey,
      email: data.email,
      reference,
    });

    if (intent.kind === "redirect") {
      return { status: "payment_redirect", url: intent.url, reference: intent.reference };
    }

    return {
      status: "payment_not_configured",
      message:
        intent.kind === "failed"
          ? intent.message
          : "Online payment is not switched on yet, so no payment was taken and no order was placed.",
      reference,
      quote: cartQuote,
    };
  });
