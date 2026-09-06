import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/lib/leads.functions";

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
          ? "You're already on the list 💜 We'll be in touch."
          : "You're on our radar 💜 Thanks for joining — we'll be in touch before launch.",
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
    <section className={purple ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}>
      <div className="mx-auto max-w-3xl px-5 py-20 text-center lg:px-8">
        <p className={`eyebrow ${purple ? "text-primary-foreground/70" : "text-primary"}`}>Stay close</p>
        <h2 className="mt-4 font-display text-3xl sm:text-4xl">Be first to taste it</h2>
        <p className={`mx-auto mt-4 max-w-xl ${purple ? "text-primary-foreground/85" : "text-muted-foreground"}`}>
          Launch news, ingredient stories and the occasional recipe. No noise.
        </p>

        {status === "done" ? (
          <p
            role="status"
            className={`mx-auto mt-8 max-w-md rounded-2xl px-6 py-5 text-sm font-medium ${
              purple ? "bg-primary-foreground/10" : "bg-card"
            }`}
          >
            {message}
          </p>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
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
              className="h-12 flex-1 rounded-full border border-border bg-background px-5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="h-12 rounded-full bg-accent px-7 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {status === "loading" ? "Joining…" : "Join the list"}
            </button>
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

        <p className={`mt-4 text-xs ${purple ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          By joining you agree to receive occasional emails from Hey! You Wellness. Unsubscribe any time.
        </p>
      </div>
    </section>
  );
}
