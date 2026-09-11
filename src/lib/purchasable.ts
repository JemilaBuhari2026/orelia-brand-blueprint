/**
 * Single client-side gate for "can this be bought?".
 *
 * This is a UX guard only — the server re-validates every commercial value
 * before an order can be created. Products that are Coming soon, Concept,
 * Hidden or Sold out are never purchasable.
 */
import { getProductCommerce, type Product } from "@/lib/catalog";
import { isPurchasable, type CommerceVariant, type ProductCommerce } from "@/lib/commerce";

export function productPurchasability(product: Product): {
  commerce: ProductCommerce;
  purchasable: boolean;
  variants: CommerceVariant[];
  requiresVariantChoice: boolean;
} {
  const commerce = getProductCommerce(product);
  const statusAllows = product.status === "available";
  const variants = commerce.variants.filter(
    (v) => v.availability !== "discontinued" && v.availability !== "out_of_stock",
  );
  const purchasable = statusAllows && isPurchasable(commerce);
  return {
    commerce,
    purchasable,
    variants,
    requiresVariantChoice: purchasable && variants.length > 1,
  };
}

export function variantPurchasable(variant: CommerceVariant): boolean {
  if (variant.availability === "out_of_stock" || variant.availability === "discontinued") {
    return false;
  }
  if (variant.inventoryTracked && (variant.inventoryQuantity ?? 0) < 1 && !variant.preorder) {
    return false;
  }
  return variant.price.amount != null && variant.price.currency != null;
}
