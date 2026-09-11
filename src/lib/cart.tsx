/**
 * Hey! You Wellness — guest cart (SPRINT 4).
 *
 * Lines reference stable identifiers (catalogue slug + commerce product id +
 * variant id), never product names. Prices held here are display snapshots
 * only — the server is the source of truth for all commercial values.
 *
 * Persistence is localStorage for guest shoppers. The shape is deliberately
 * portable so an authenticated cart can be synced later without a rewrite.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { track, commerceEvents } from "@/lib/analytics";

export type CartLine = {
  /** Catalogue slug — stable content identifier. */
  catalogSlug: string;
  /** Commerce product identifier (backend). */
  productId: string;
  /** Variant identifier, when the product has variants. */
  variantId: string | null;
  quantity: number;
  /** Display-only snapshot; re-validated server-side before checkout. */
  unitPriceSnapshot: number | null;
  currencySnapshot: string | null;
};

export const MAX_LINE_QUANTITY = 20;

type CartState = {
  lines: CartLine[];
  hydrated: boolean;
  count: number;
  addLine: (line: Omit<CartLine, "quantity"> & { quantity?: number }) => void;
  setQuantity: (productId: string, variantId: string | null, quantity: number) => void;
  removeLine: (productId: string, variantId: string | null) => void;
  clear: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const STORAGE_KEY = "heyyou.cart.v1";

const CartContext = createContext<CartState | null>(null);

function sameLine(line: CartLine, productId: string, variantId: string | null) {
  return line.productId === productId && (line.variantId ?? null) === (variantId ?? null);
}

function sanitize(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((raw): CartLine[] => {
    if (!raw || typeof raw !== "object") return [];
    const item = raw as Record<string, unknown>;
    const productId = typeof item["productId"] === "string" ? item["productId"] : null;
    const catalogSlug = typeof item["catalogSlug"] === "string" ? item["catalogSlug"] : null;
    const quantity = typeof item["quantity"] === "number" ? Math.floor(item["quantity"]) : 0;
    if (!productId || !catalogSlug || quantity < 1) return [];
    return [
      {
        productId,
        catalogSlug,
        variantId: typeof item["variantId"] === "string" ? item["variantId"] : null,
        quantity: Math.min(quantity, MAX_LINE_QUANTITY),
        unitPriceSnapshot:
          typeof item["unitPriceSnapshot"] === "number" ? item["unitPriceSnapshot"] : null,
        currencySnapshot:
          typeof item["currencySnapshot"] === "string" ? item["currencySnapshot"] : null,
      },
    ];
  });
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setLines(sanitize(JSON.parse(stored)));
    } catch {
      /* corrupt or unavailable storage — start with an empty cart */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage full or blocked — the cart still works for this session */
    }
  }, [lines, hydrated]);

  const addLine = useCallback<CartState["addLine"]>((line) => {
    const quantity = Math.max(1, Math.min(line.quantity ?? 1, MAX_LINE_QUANTITY));
    setLines((current) => {
      const existing = current.find((l) => sameLine(l, line.productId, line.variantId));
      if (existing) {
        return current.map((l) =>
          sameLine(l, line.productId, line.variantId)
            ? { ...l, quantity: Math.min(l.quantity + quantity, MAX_LINE_QUANTITY) }
            : l,
        );
      }
      return [...current, { ...line, quantity }];
    });
    track(commerceEvents.addToCart, {
      productId: line.productId,
      variantId: line.variantId,
      quantity,
    });
    setIsOpen(true);
  }, []);

  const setQuantity = useCallback<CartState["setQuantity"]>((productId, variantId, quantity) => {
    const next = Math.floor(quantity);
    setLines((current) =>
      next < 1
        ? current.filter((l) => !sameLine(l, productId, variantId))
        : current.map((l) =>
            sameLine(l, productId, variantId)
              ? { ...l, quantity: Math.min(next, MAX_LINE_QUANTITY) }
              : l,
          ),
    );
  }, []);

  const removeLine = useCallback<CartState["removeLine"]>((productId, variantId) => {
    setLines((current) => current.filter((l) => !sameLine(l, productId, variantId)));
    track(commerceEvents.removeFromCart, { productId, variantId });
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartState>(
    () => ({
      lines,
      hydrated,
      count: lines.reduce((sum, l) => sum + l.quantity, 0),
      addLine,
      setQuantity,
      removeLine,
      clear,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    }),
    [lines, hydrated, isOpen, addLine, setQuantity, removeLine, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export function formatMoney(amount: number | null, currency: string | null): string | null {
  if (amount == null || !currency) return null;
  try {
    return new Intl.NumberFormat("en-NG", { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}
