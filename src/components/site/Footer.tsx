import { Link } from "@tanstack/react-router";
import { Instagram, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 bg-cocoa text-cocoa-foreground">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-display text-3xl leading-tight">
              Hey! You should be able to enjoy taking care of yourself.
            </p>
            <p className="mt-4 max-w-sm text-sm text-cocoa-foreground/70">
              A premium African wellness food brand connecting nourishment, gut health, mood and everyday
              wellbeing.
            </p>
          </div>

          <div>
            <h3 className="eyebrow text-cocoa-foreground/60">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                { to: "/products", label: "Products" },
                { to: "/superfoods", label: "African Superfoods" },
                { to: "/story", label: "Our Story" },
                { to: "/journal", label: "Wellness Journal" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-cocoa-foreground/80 transition-colors hover:text-cocoa-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow text-cocoa-foreground/60">Work with us</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/corporate" className="text-cocoa-foreground/80 transition-colors hover:text-cocoa-foreground">
                  Corporate & Gifting
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-cocoa-foreground/80 transition-colors hover:text-cocoa-foreground">
                  Stockists & wholesale
                </Link>
              </li>
              <li className="flex items-center gap-2 pt-2 text-cocoa-foreground/80">
                <Mail className="size-4" /> hello@heyyouwellness.com
              </li>
              <li className="flex items-center gap-2 text-cocoa-foreground/80">
                <Instagram className="size-4" /> @heyyouwellness
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-cocoa-foreground/15 pt-6 text-xs text-cocoa-foreground/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Hey! You Wellness. Hey! You is a registered trademark.</p>
          <p>Lagos, Nigeria</p>
        </div>
      </div>
    </footer>
  );
}
