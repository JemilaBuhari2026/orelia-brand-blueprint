/**
 * Hey! You Wellness — analytics event surface (architecture only).
 *
 * No analytics provider is installed. `track` simply dispatches a DOM custom
 * event and logs in development, so a provider can be attached later without
 * touching any component.
 */
import { analyticsEvents, type AnalyticsEvent } from "@/lib/commerce";

export const commerceEvents = {
  ...analyticsEvents,
  removeFromCart: "remove_from_cart",
  cartView: "cart_view",
  beginCheckout: "begin_checkout",
  checkoutContactSubmitted: "checkout_contact_submitted",
  checkoutShippingSubmitted: "checkout_shipping_submitted",
  paymentStarted: "payment_started",
} as const;

export type CommerceEventName =
  | AnalyticsEvent
  | (typeof commerceEvents)[keyof typeof commerceEvents];

export function track(event: CommerceEventName, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("heyyou:analytics", { detail: { event, payload } }));
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, payload);
  }
}
