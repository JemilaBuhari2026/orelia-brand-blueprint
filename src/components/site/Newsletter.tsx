import { useState, type FormEvent } from "react";
import { toast } from "sonner";

export function Newsletter({ tone = "cream" }: { tone?: "cream" | "purple" }) {
  const [email, setEmail] = useState("");
  const purple = tone === "purple";

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Thank you — we'll be in touch before launch.");
    setEmail("");
  }

  return (
    <section className={purple ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}>
      <div className="mx-auto max-w-3xl px-5 py-20 text-center lg:px-8">
        <p className={`eyebrow ${purple ? "text-primary-foreground/70" : "text-primary"}`}>Stay close</p>
        <h2 className="mt-4 font-display text-3xl sm:text-4xl">Be first to taste it</h2>
        <p className={`mx-auto mt-4 max-w-xl ${purple ? "text-primary-foreground/85" : "text-muted-foreground"}`}>
          Launch news, ingredient stories and the occasional recipe. No noise.
        </p>
        <form onSubmit={onSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="h-12 flex-1 rounded-full border border-border bg-background px-5 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            className="h-12 rounded-full bg-accent px-7 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
          >
            Join the list
          </button>
        </form>
      </div>
    </section>
  );
}
