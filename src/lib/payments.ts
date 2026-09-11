/**
 * Payment provider abstraction (SPRINT 4).
 *
 * No payment provider is integrated. This interface exists so a provider can be
 * added later without changing the cart, checkout or order architecture:
 *
 *   Cart -> Checkout -> Payment -> Order
 *
 * Rules:
 * - Never collect or store raw card details.
 * - Never display a fake payment form or a fake successful payment.
 */
import type { PaymentStatus } from "@/lib/commerce";

export type PaymentIntentRequest = {
  /** Server-trusted total, in minor-unit-safe decimal form. */
  amount: number;
  currency: string;
  /** Prevents duplicate charges from repeated submissions. */
  idempotencyKey: string;
  email: string;
  reference: string;
};

export type PaymentIntentResult =
  | { kind: "not_configured"; message: string }
  | { kind: "redirect"; url: string; reference: string }
  | { kind: "failed"; message: string };

export interface PaymentProvider {
  id: string;
  label: string;
  isConfigured(): boolean;
  createIntent(request: PaymentIntentRequest): Promise<PaymentIntentResult>;
}

/** Placeholder provider used while no real provider is configured. */
export const unconfiguredPaymentProvider: PaymentProvider = {
  id: "none",
  label: "Not configured",
  isConfigured: () => false,
  createIntent: async () => ({
    kind: "not_configured",
    message:
      "Online payment is not switched on yet. Your details have been checked and no payment was taken.",
  }),
};

let activeProvider: PaymentProvider = unconfiguredPaymentProvider;

export function registerPaymentProvider(provider: PaymentProvider) {
  activeProvider = provider;
}

export function getPaymentProvider(): PaymentProvider {
  return activeProvider;
}

/** Architecture-only lifecycle states; never displayed as a fake status. */
export const paymentStatuses: PaymentStatus[] = [
  "pending",
  "paid",
  "failed",
  "refunded",
  "partially_refunded",
];
