import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/lib/leads.functions";
import { CtaButton } from "./Cta";

export function Newsletter({
  tone = "cream",
  source = "website",
}: {
  tone?: "cream" | "purple";
  source?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const subscribe = useServerFn(subscribeToNewsletter);
  const purple = tone === "purple";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const value = email.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(value)) {
      setError("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    try {
      const result = await subscribe({ data: { email: value, source, consent: true } });
      setStatus("done");
      setEmail("");
      setMessage(
        result.status === "already"
          ? "You're already on the list. We'll be in touch."
          : "You're in. Look out for us before launch.",
      );
    } catch (err) {
      setStatus("idle");
      const text =
        err instanceof Error && err.message
          ? err.message
          : "We couldn't add you to the list. Please try again in a moment.";
      setError(text);
      toast.error(text);
    }
  }

  return (
    <section
      className={
        purple
          ? "grain relative overflow-hidden bg-primary text-primary-foreground"
          : "grain relative overflow-hidden bg-secondary text-foreground"
      }
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute -left-28 bottom--20 size-[22rem] rounded-full blur-3xl ${
          purple ? "bg-accent/25" : "bg-primary/10"
        }`}
      />
      <div className="shell relative grid gap-10 py-20 lg:grid-cols-[1fr_auto] lg:items-end lg:py-24">
        <div className="max-w-xl">
          <p className={`eyebrow ${purple ? "text-primary-foreground/65" : "text-primary"}`}>Hey! You list</p>
          <h2 className="mt-4 display-2">A little goodness, straight to your inbox.</h2>
          <p className={`mt-4 lede ${purple ? "text-primary-foreground/85" : "text-muted-foreground"}`}>
            Launch news, ingredient stories and the occasional recipe. No noise, no lectures.
          </p>
        </div>

        <div className="w-full lg:w-[26rem]">
          {status === "done" ? (
            <p
              role="status"
              className={`rounded-2xl px-6 py-5 text-sm font-medium ${
                purple ? "bg-primary-foreground/12" : "bg-card shadow-soft"
              }`}
            >
              {message}
            </p>
          ) : (
            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor={`newsletter-email-${tone}`} className="sr-only">
                Email address
              </label>
              <input
                id={`newsletter-email-${tone}`}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `newsletter-error-${tone}` : undefined}
                className="h-12 flex-1 rounded-full border border-border bg-background px-5 text-sm text-foreground outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-primary"
              />
              <CtaButton type="submit" variant={purple ? "onDark" : "primary"} disabled={status === "loading"}>
                {status === "loading" ? "Joining…" : "Join the list"}
              </CtaButton>
            </form>
          )}

          {error ? (
            <p
              id={`newsletter-error-${tone}`}
              role="alert"
              className={`mt-3 text-sm ${purple ? "text-primary-foreground" : "text-destructive"}`}
            >
              {error}
            </p>
          ) : null}

          <p className={`mt-4 meta ${purple ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
            By joining you agree to receive occasional emails from Hey! You Wellness. Unsubscribe any time.
          </p>
        </div>
      </div>
    </section>
  );
}
