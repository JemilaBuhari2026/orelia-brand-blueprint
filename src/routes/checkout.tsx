import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import logoAsset from "@/assets/heyyou-logo-master.png.asset.json";
import { CtaButton, CtaLink } from "@/components/site/Cta";
import { OrderTotals } from "@/components/site/CartLines";
import { useCartQuote } from "@/components/site/CartDrawer";
import { formatMoney, useCart } from "@/lib/cart";
import { getProduct } from "@/lib/catalog";
import { submitCheckout, type CheckoutResult } from "@/lib/checkout.functions";
import { track, commerceEvents } from "@/lib/analytics";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Hey! You Wellness" },
      {
        name: "description",
        content: "Secure guest checkout for Hey! You Wellness. No account needed.",
      },
      { property: "og:title", content: "Checkout — Hey! You Wellness" },
      {
        property: "og:description",
        content: "Secure guest checkout for Hey! You Wellness. No account needed.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

const countries = [
  { code: "NG", label: "Nigeria" },
  { code: "GB", label: "United Kingdom" },
  { code: "US", label: "United States" },
  { code: "GH", label: "Ghana" },
  { code: "KE", label: "Kenya" },
  { code: "ZA", label: "South Africa" },
];

type FieldErrors = Partial<Record<string, string>>;

function newIdempotencyKey() {
  return `chk_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

function CheckoutPage() {
  const { lines, hydrated } = useCart();
  const { data: quote } = useCartQuote();
  const navigate = useNavigate();
  const runCheckout = useServerFn(submitCheckout);

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<CheckoutResult | null>(null);
  const [idempotencyKey, setIdempotencyKey] = useState(newIdempotencyKey);

  useEffect(() => {
    track(commerceEvents.beginCheckout, { lines: lines.length });
  }, [lines.length]);

  const canCheckout = Boolean(quote?.purchasable);

  const summaryLines = useMemo(
    () =>
      lines.map((line) => {
        const product = getProduct(line.catalogSlug);
        const quoted = quote?.lines.find(
          (l) =>
            l.productId === line.productId && (l.variantId ?? null) === (line.variantId ?? null),
        );
        return {
          key: `${line.productId}:${line.variantId ?? "base"}`,
          name: product?.name ?? "Item",
          image: product?.hero,
          variantName: product?.variants?.find((v) => v.id === line.variantId)?.name ?? null,
          quantity: line.quantity,
          unitPrice: formatMoney(quoted?.unitPrice ?? null, quoted?.currency ?? null),
          lineTotal: formatMoney(quoted?.lineTotal ?? null, quoted?.currency ?? null),
        };
      }),
    [lines, quote],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const form = new FormData(event.currentTarget);
    const value = (key: string) => String(form.get(key) ?? "").trim();

    const nextErrors: FieldErrors = {};
    if (!value("fullName")) nextErrors["fullName"] = "Please enter your full name.";
    if (!value("email")) nextErrors["email"] = "Please enter your email address.";
    if (!value("phone")) nextErrors["phone"] = "Please enter a phone number we can reach you on.";
    if (!value("state")) nextErrors["state"] = "Please enter your state or region.";
    if (!value("city")) nextErrors["city"] = "Please enter your city or town.";
    if (value("address").length < 6) {
      nextErrors["address"] = "Please enter your full delivery address.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setFormError("Please correct the highlighted fields and try again.");
      return;
    }

    setFormError(null);
    setSubmitting(true);
    track(commerceEvents.checkoutContactSubmitted, {});
    track(commerceEvents.paymentStarted, {});

    try {
      const response = await runCheckout({
        data: {
          email: value("email"),
          phone: value("phone"),
          fullName: value("fullName"),
          country: value("country") || "NG",
          state: value("state"),
          city: value("city"),
          address: value("address"),
          deliveryNotes: value("deliveryNotes"),
          idempotencyKey,
          lines: lines.map((l) => ({
            catalogSlug: l.catalogSlug,
            productId: l.productId,
            variantId: l.variantId,
            quantity: l.quantity,
          })),
        },
      });
      setResult(response);
      if (response.status === "payment_redirect") {
        window.location.assign(response.url);
        return;
      }
      // A new submission attempt gets a fresh key; repeated taps reuse this one.
      setIdempotencyKey(newIdempotencyKey());
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "We could not check your details. Please check your connection and try again.";
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (hydrated && lines.length === 0 && !result) {
    return (
      <CheckoutShell>
        <div className="mx-auto max-w-xl py-16 text-center">
          <h1 className="display-2">Your bag is empty</h1>
          <p className="mt-4 text-muted-foreground">
            Add something to your bag before checking out.
          </p>
          <div className="mt-7 flex justify-center">
            <CtaLink to="/products" size="lg">
              Explore products
            </CtaLink>
          </div>
        </div>
      </CheckoutShell>
    );
  }

  return (
    <CheckoutShell>
      <div className="grid gap-10 py-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 lg:py-12">
        <div>
          <h1 className="display-2">Checkout</h1>
          <p className="mt-3 text-muted-foreground">
            Checking out as a guest — no account needed.
          </p>

          {!canCheckout ? (
            <div
              role="status"
              className="mt-6 rounded-2xl border-2 border-cocoa/12 bg-secondary/60 p-5 text-sm"
            >
              <p className="font-semibold text-foreground">Checkout is not open yet</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                {(quote?.issues.length ? quote.issues : ["No items in your bag can be bought yet."]).map(
                  (issue) => (
                    <li key={issue}>{issue}</li>
                  ),
                )}
              </ul>
              <p className="mt-3 text-muted-foreground">
                You can still fill in your details below — nothing is charged and no order is
                placed.
              </p>
            </div>
          ) : null}

          <form noValidate onSubmit={handleSubmit} className="mt-8 space-y-8">
            <Fieldset legend="Contact">
              <Field
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                error={errors["email"]}
              />
              <Field
                label="Phone number"
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="0801 234 5678"
                error={errors["phone"]}
              />
            </Fieldset>

            <Fieldset legend="Your details">
              <Field
                label="Full name"
                name="fullName"
                autoComplete="name"
                error={errors["fullName"]}
              />
            </Fieldset>

            <Fieldset legend="Delivery">
              <div>
                <label htmlFor="country" className="block text-sm font-semibold text-foreground">
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  defaultValue="NG"
                  autoComplete="country"
                  className="mt-2 min-h-12 w-full rounded-xl border-2 border-cocoa/15 bg-background px-4 text-base text-foreground focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <Field
                label="State / region"
                name="state"
                autoComplete="address-level1"
                error={errors["state"]}
              />
              <Field
                label="City / town"
                name="city"
                autoComplete="address-level2"
                error={errors["city"]}
              />
              <Field
                label="Delivery address"
                name="address"
                autoComplete="street-address"
                error={errors["address"]}
              />
              <div>
                <label
                  htmlFor="deliveryNotes"
                  className="block text-sm font-semibold text-foreground"
                >
                  Delivery notes <span className="font-normal text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  id="deliveryNotes"
                  name="deliveryNotes"
                  rows={3}
                  maxLength={500}
                  className="mt-2 w-full rounded-xl border-2 border-cocoa/15 bg-background px-4 py-3 text-base text-foreground focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2"
                />
              </div>
            </Fieldset>

            {formError ? (
              <p role="alert" className="text-sm font-semibold text-destructive">
                {formError}
              </p>
            ) : null}

            {result && result.status !== "payment_redirect" ? (
              <div
                role="status"
                className="rounded-2xl border-2 border-cocoa/12 bg-secondary/60 p-5 text-sm"
              >
                <p className="font-semibold text-foreground">
                  {result.status === "payment_not_configured"
                    ? "Details checked — no payment taken"
                    : "We can't complete this order yet"}
                </p>
                <p className="mt-2 text-muted-foreground">{result.message}</p>
                {result.status === "payment_not_configured" ? (
                  <p className="mt-2 text-muted-foreground">
                    Your reference for this attempt is{" "}
                    <span className="font-semibold text-foreground">{result.reference}</span>. Need
                    help? <Link to="/contact" className="text-primary underline">Contact us</Link>.
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-4">
              <CtaButton type="submit" size="lg" disabled={submitting} aria-busy={submitting}>
                {submitting ? "Checking your details…" : "Continue as guest"}
              </CtaButton>
              <button
                type="button"
                onClick={() => navigate({ to: "/cart" })}
                className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-4" aria-hidden /> Back to bag
              </button>
            </div>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="size-4" aria-hidden /> We only ask for what we need to deliver
              your order.
            </p>
          </form>
        </div>

        <aside className="h-fit rounded-[1.5rem] border-2 border-cocoa/12 bg-card p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-2xl">Order summary</h2>
          <ul className="mt-5 space-y-4">
            {summaryLines.map((line) => (
              <li key={line.key} className="flex gap-3">
                {line.image ? (
                  <img
                    src={line.image.src}
                    alt={line.image.alt}
                    width={120}
                    height={150}
                    loading="lazy"
                    className="size-16 rounded-xl object-cover"
                  />
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{line.name}</p>
                  {line.variantName ? (
                    <p className="text-sm text-muted-foreground">{line.variantName}</p>
                  ) : null}
                  <p className="text-sm text-muted-foreground">
                    Qty {line.quantity}
                    {line.unitPrice ? ` · ${line.unitPrice} each` : ""}
                  </p>
                </div>
                {line.lineTotal ? (
                  <p className="text-sm font-semibold text-foreground">{line.lineTotal}</p>
                ) : null}
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-border/60 pt-5">
            <OrderTotals quote={quote} />
          </div>
        </aside>
      </div>
    </CheckoutShell>
  );
}

function CheckoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="border-b border-border/60">
        <div className="shell flex items-center justify-between py-4">
          <Link to="/" aria-label="Hey! You Wellness home">
            <img src={logoAsset.url} alt="Hey! You Wellness" width={788} height={1134} className="h-12 w-auto" />
          </Link>
          <Link to="/cart" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Back to bag
          </Link>
        </div>
      </header>
      <main id="main" className="shell flex-1">
        {children}
      </main>
      <footer className="border-t border-border/60 py-6">
        <div className="shell text-sm text-muted-foreground">
          Need help with your order? <Link to="/contact" className="text-primary underline">Contact us</Link>.
        </div>
      </footer>
    </div>
  );
}

function Fieldset({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4">
      <legend className="eyebrow text-primary">{legend}</legend>
      {children}
    </fieldset>
  );
}

function Field({
  label,
  name,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string; error?: string | undefined }) {
  const errorId = `${name}-error`;
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="mt-2 min-h-12 w-full rounded-xl border-2 border-cocoa/15 bg-background px-4 text-base text-foreground focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 aria-[invalid=true]:border-destructive"
        {...props}
      />
      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
