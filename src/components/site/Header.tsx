import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import logoAsset from "@/assets/heyyou-logo-master.png.asset.json";
import { CtaLink } from "./Cta";
import { CartButton } from "./CartButton";
import { AccountButton } from "./AccountButton";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/products", label: "Products" },
  { to: "/superfoods", label: "African Superfoods" },
  { to: "/journal", label: "Wellness Journal" },
  { to: "/story", label: "Our Story" },
];

const secondary = [
  { to: "/corporate", label: "Corporate & Gifting" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300",
        scrolled
          ? "border-b border-border/70 bg-background/88 shadow-hairline backdrop-blur-md"
          : "border-b border-transparent bg-background",
      )}
    >
      <div
        className={cn(
          "shell flex items-center justify-between gap-6 transition-[padding] duration-300",
          scrolled ? "py-2.5" : "py-4",
        )}
      >
        <Link to="/" className="flex items-center" onClick={() => setOpen(false)} aria-label="Hey! You Wellness home">
          <img
            src={logoAsset.url}
            alt="Hey! You Wellness"
            width={788}
            height={1134}
            className={cn(
              "w-auto transition-[height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              scrolled ? "h-12 sm:h-14" : "h-14 sm:h-[4.5rem]",
            )}
          />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group relative py-1 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground [&.active]:text-primary"
            >
              {item.label}
              <span className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-[.active]:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <Link
            to="/corporate"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Corporate & Gifting
          </Link>
          <CtaLink to="/contact" variant="primary">
            Say hey
          </CtaLink>
          <div className="-mr-2 flex items-center">
            <AccountButton />
            <CartButton />
          </div>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <AccountButton />
          <CartButton />
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 grid size-11 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary lg:hidden"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background lg:hidden">
          <nav aria-label="Mobile" className="shell flex flex-col pb-8 pt-2">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="border-b border-border/50 py-4 font-display text-2xl text-foreground [&.active]:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-6 flex flex-col gap-3">
              {secondary.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-muted-foreground [&.active]:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <CtaLink to="/contact" variant="primary" size="lg" className="mt-7" onClick={() => setOpen(false)}>
              Say hey
            </CtaLink>
          </nav>
        </div>
      )}
    </header>
  );
}
