import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="grain relative overflow-hidden bg-primary text-primary-foreground">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-32 size-[26rem] rounded-full bg-primary-foreground/7 blur-3xl"
      />
      <div className="shell relative section-y">
        <p className="eyebrow text-primary-foreground/65">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl display-1">{title}</h1>
        {intro && <p className="mt-6 max-w-2xl lede text-primary-foreground/85">{intro}</p>}
      </div>
    </section>
  );
}
