/**
 * Hey! You Wellness — commerce foundation (SPRINT 3).
 *
 * ARCHITECTURE ONLY. Nothing here is customer-facing yet.
 *
 * RULES (do not break):
 * - No prices, SKUs, pack sizes, weights, stock levels or tax/shipping values
 *   are invented. Every commercial value stays `null`/`undefined` until real
 *   data is entered by the business.
 * - The frontend catalogue (`src/lib/catalog.ts`) remains the single source of
 *   truth for product identity and content. Commerce data EXTENDS it via
 *   `catalogSlug` / `productId` references — it never duplicates copy or media.
 * - Customer status (Coming soon / Available / ...) is deliberately separate
 *   from commerce readiness. A product is purchasable only when
 *   `sellable === true` AND `commerceStatus === "live"` AND a real price exists.
 */

/** Internal commerce readiness — NOT the customer-facing product status. */
export type CommerceStatus =
  | "not_ready"
  | "draft"
  | "ready"
  | "live"
  | "retired";

export type AvailabilityStatus =
  | "unknown"
  | "in_stock"
  | "out_of_stock"
  | "preorder"
  | "discontinued";

/** Commercial channels. Rules may differ per channel in later sprints. */
export type SalesChannel = "dtc" | "wholesale" | "corporate" | "gifting";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "partially_refunded";

export type FulfillmentStatus =
  | "unfulfilled"
  | "partially_fulfilled"
  | "fulfilled"
  | "returned";

/** Money is always explicit about currency; both sides are nullable until set. */
export type Money = {
  amount: number | null;
  currency: string | null;
};

export type Dimensions = {
  lengthMm: number | null;
  widthMm: number | null;
  heightMm: number | null;
};

/** Product -> Variant -> SKU -> Price -> Inventory. */
export type CommerceVariant = {
  /** Stable identifier a future cart/order line can reference. */
  id: string;
  productId: string;
  name: string;
  /** e.g. "flavour" | "pack-size" | "multipack" | "gift-format". */
  variantType?: string;
  sku: string | null;
  barcode: string | null;
  isDefault: boolean;
  price: Money;
  compareAtPrice: Money;
  packSize: number | null;
  unit: string | null;
  availability: AvailabilityStatus;
  inventoryTracked: boolean;
  inventoryQuantity: number | null;
  lowStockThreshold: number | null;
  preorder: boolean;
  weightGrams: number | null;
  dimensions: Dimensions;
  channels: SalesChannel[];
};

/** Commerce extension of a catalogue product, keyed by the catalogue slug. */
export type ProductCommerce = {
  catalogSlug: string;
  sellable: boolean;
  commerceStatus: CommerceStatus;
  sku: string | null;
  barcode: string | null;
  price: Money;
  compareAtPrice: Money;
  taxCategory: string | null;
  shippingClass: string | null;
  channels: SalesChannel[];
  variants: CommerceVariant[];
  defaultVariantId: string | null;
};

export type BundleItem = {
  productId: string | null;
  variantId: string | null;
  quantity: number;
};

export type CommerceBundle = {
  id: string;
  slug: string;
  name: string;
  commerceStatus: CommerceStatus;
  price: Money;
  compareAtPrice: Money;
  channels: SalesChannel[];
  items: BundleItem[];
};

/** A future cart line references identifiers plus a price snapshot. */
export type CartLineRef = {
  productId: string;
  variantId: string | null;
  quantity: number;
  priceSnapshot: Money;
};

/**
 * Historical orders keep their own snapshots so later catalogue/price edits
 * never rewrite the past. Mirrors the `order_items` table.
 */
export type OrderItemSnapshot = {
  productId: string | null;
  variantId: string | null;
  bundleId: string | null;
  productNameSnapshot: string;
  variantNameSnapshot: string | null;
  skuSnapshot: string | null;
  unitPriceSnapshot: Money;
  quantity: number;
  lineTotalSnapshot: Money;
};

const emptyMoney: Money = { amount: null, currency: null };

/**
 * Default commerce record for a catalogue product that has no commercial data
 * yet. Nothing is sellable, nothing is priced.
 */
export function defaultProductCommerce(catalogSlug: string): ProductCommerce {
  return {
    catalogSlug,
    sellable: false,
    commerceStatus: "not_ready",
    sku: null,
    barcode: null,
    price: { ...emptyMoney },
    compareAtPrice: { ...emptyMoney },
    taxCategory: null,
    shippingClass: null,
    channels: [],
    variants: [],
    defaultVariantId: null,
  };
}

/** Single gate for any future purchase UI. Currently false for everything. */
export function isPurchasable(commerce?: ProductCommerce): boolean {
  if (!commerce) return false;
  return (
    commerce.sellable &&
    commerce.commerceStatus === "live" &&
    commerce.price.amount != null &&
    commerce.price.currency != null
  );
}

/** True only when a real price exists — never render a placeholder price. */
export function hasDisplayablePrice(money: Money | undefined): boolean {
  return Boolean(money && money.amount != null && money.currency != null);
}

/** True only when real, tracked inventory exists — no invented stock messages. */
export function hasLiveInventory(variant: CommerceVariant | undefined): boolean {
  return Boolean(
    variant && variant.inventoryTracked && variant.inventoryQuantity != null,
  );
}

/** Global commerce kill-switch. Sprint 3 is architecture only. */
export const COMMERCE_ENABLED = false;

/** Canonical analytics event names for future instrumentation. */
export const analyticsEvents = {
  productView: "product_view",
  productSelect: "product_select",
  productVariantSelect: "product_variant_select",
  addToCart: "add_to_cart",
  checkoutStart: "checkout_start",
  purchase: "purchase",
  newsletterSignup: "newsletter_signup",
  enquirySubmit: "enquiry_submit",
} as const;

export type AnalyticsEvent =
  (typeof analyticsEvents)[keyof typeof analyticsEvents];
