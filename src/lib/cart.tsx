/**
 * Hey! You Wellness — bag.
 *
 * Guests: lines live in localStorage (heyyou.cart.v1), exactly as before.
 * Signed in: the account bag in the database (carts / cart_items) is the source
 * of truth. At sign-in the guest bag is merged into the account bag, then
 * cleared locally. Every change goes through the shared cart functions
 * (cart_set_item / cart_merge / cart_clear) that the mobile app also uses, and
 * a live subscription keeps every signed-in device in step.
 *
 * Prices held here are display snapshots only — the server re-quotes everything.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { track, commerceEvents } from "@/lib/analytics";
import { useAuth } from "@/lib/auth";
import { getProduct, getProductCommerce } from "@/lib/catalog";

export type CartLine = {
  /** Catalogue slug — stable content identifier. */
  catalogSlug: string;
  /** Commerce product identifier. */
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
  /** True when the bag is the signed-in account bag. */
  synced: boolean;
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

function readGuest(): CartLine[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? sanitize(JSON.parse(stored)) : [];
  } catch {
    return [];
  }
}

function writeGuest(lines: CartLine[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    /* storage blocked — the bag still works for this session */
  }
}

/** Builds a display line from an account row (prices from the catalogue mirror). */
function fromRow(row: { catalog_slug: string; variant_id: string | null; quantity: number }): CartLine {
  const product = getProduct(row.catalog_slug);
  const commerce = product ? getProductCommerce(product) : null;
  const variant = commerce?.variants.find((v) => v.id === row.variant_id);
  return {
    catalogSlug: row.catalog_slug,
    productId: commerce?.catalogSlug ?? row.catalog_slug,
    variantId: row.variant_id,
    quantity: row.quantity,
    unitPriceSnapshot: variant?.price.amount ?? commerce?.price.amount ?? null,
    currencySnapshot: variant?.price.currency ?? commerce?.price.currency ?? null,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id ?? null;
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const linesRef = useRef(lines);
  linesRef.current = lines;

  const fetchAccount = useCallback(async () => {
    const { data, error } = await supabase
      .from("cart_items")
      .select("catalog_slug, variant_id, quantity")
      .order("created_at", { ascending: true });
    if (error) {
      console.error("bag load failed", error.message);
      return;
    }
    setLines((data ?? []).map(fromRow));
  }, []);

  // Choose guest vs account bag whenever the signed-in user changes.
  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;

    if (!userId) {
      setLines(readGuest());
      setHydrated(true);
      return;
    }

    setHydrated(false);
    (async () => {
      const guest = readGuest();
      if (guest.length) {
        const { error } = await supabase.rpc("cart_merge", {
          _items: guest.map((l) => ({
            catalog_slug: l.catalogSlug,
            variant_id: l.variantId,
            quantity: l.quantity,
          })),
        });
        if (!error) writeGuest([]);
        else console.error("bag merge failed", error.message);
      }
      if (!cancelled) {
        await fetchAccount();
        setHydrated(true);
      }
    })();

    // Live updates from any other signed-in device.
    const channel = supabase
      .channel(`cart:${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cart_items", filter: `user_id=eq.${userId}` },
        () => {
          void fetchAccount();
        },
      )
      .subscribe();

    const onVisible = () => {
      if (document.visibilityState === "visible") void fetchAccount();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      void supabase.removeChannel(channel);
    };
  }, [userId, authLoading, fetchAccount]);

  // Guests keep localStorage persistence.
  useEffect(() => {
    if (!hydrated || userId) return;
    writeGuest(lines);
  }, [lines, hydrated, userId]);

  const pushAccount = useCallback(
    async (catalogSlug: string, variantId: string | null, quantity: number, mode: "set" | "add") => {
      const { error } = await supabase.rpc("cart_set_item", {
        _catalog_slug: catalogSlug,
        _variant_id: variantId as string,
        _quantity: quantity,
        _mode: mode,
      });
      if (error) {
        toast.error("We couldn't update your bag. Please try again.");
        console.error("bag update failed", error.message);
        void fetchAccount();
      }
    },
    [fetchAccount],
  );

  const addLine = useCallback<CartState["addLine"]>(
    (line) => {
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
      if (userId) void pushAccount(line.catalogSlug, line.variantId, quantity, "add");
      track(commerceEvents.addToCart, {
        productId: line.productId,
        variantId: line.variantId,
        quantity,
      });
      setIsOpen(true);
    },
    [userId, pushAccount],
  );

  const setQuantity = useCallback<CartState["setQuantity"]>(
    (productId, variantId, quantity) => {
      const next = Math.max(0, Math.min(Math.floor(quantity), MAX_LINE_QUANTITY));
      const target = linesRef.current.find((l) => sameLine(l, productId, variantId));
      setLines((current) =>
        next < 1
          ? current.filter((l) => !sameLine(l, productId, variantId))
          : current.map((l) => (sameLine(l, productId, variantId) ? { ...l, quantity: next } : l)),
      );
      if (userId && target) void pushAccount(target.catalogSlug, variantId, next, "set");
    },
    [userId, pushAccount],
  );

  const removeLine = useCallback<CartState["removeLine"]>(
    (productId, variantId) => {
      const target = linesRef.current.find((l) => sameLine(l, productId, variantId));
      setLines((current) => current.filter((l) => !sameLine(l, productId, variantId)));
      if (userId && target) void pushAccount(target.catalogSlug, variantId, 0, "set");
      track(commerceEvents.removeFromCart, { productId, variantId });
    },
    [userId, pushAccount],
  );

  const clear = useCallback(() => {
    setLines([]);
    if (userId) {
      void supabase.rpc("cart_clear").then(({ error }) => {
        if (error) console.error("bag clear failed", error.message);
      });
    }
  }, [userId]);

  const value = useMemo<CartState>(
    () => ({
      lines,
      hydrated,
      synced: Boolean(userId),
      count: lines.reduce((sum, l) => sum + l.quantity, 0),
      addLine,
      setQuantity,
      removeLine,
      clear,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    }),
    [lines, hydrated, userId, isOpen, addLine, setQuantity, removeLine, clear],
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
