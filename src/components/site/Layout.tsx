import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { HeyYouBlob, HeyYouBurst, HeyYouFloatingDecoration } from "./Decor";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
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
      <HeyYouBlob tone="purple-deep" shape="a" opacity={0.6} blur className="-right-32 -top-32 size-[30rem]" />
      <HeyYouBlob tone="lime" shape="c" opacity={0.14} blur className="-left-24 -bottom-10 size-72" />
      <HeyYouFloatingDecoration className="right-10 bottom-8 hidden opacity-60 md:block" duration={13}>
        <HeyYouBurst tone="lime" className="size-14" />
      </HeyYouFloatingDecoration>
      <div className="shell relative section-y">
        <p className="eyebrow fade-up text-lime">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl display-1 fade-up" style={{ animationDelay: "90ms" }}>
          {title}
        </h1>
        {intro && (
          <p
            className="mt-6 max-w-2xl lede fade-up text-primary-foreground/85"
            style={{ animationDelay: "180ms" }}
          >
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
