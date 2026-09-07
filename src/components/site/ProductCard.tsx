import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { statusCta, statusLabels, type Product } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  showStatus = true,
  className,
}: {
  product: Product;
  showStatus?: boolean;
  className?: string;
}) {
  return (
    <Link
      to="/products/$slug"
      params={{ slug: product.slug }}
      className={cn("group flex h-full flex-col focus-visible:outline-none", className)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-secondary">
        <img
          src={product.hero.src}
          alt={product.hero.alt}
          loading="lazy"
          width={1024}
          height={1280}
          className="aspect-[4/5] w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]"
        />
        {showStatus ? (
          <span className="absolute left-4 top-4 rounded-full bg-background/92 px-3 py-1 meta font-semibold text-foreground shadow-soft">
            {statusLabels[product.status]}
          </span>
        ) : null}
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow text-accent">{product.family}</p>
          <h3 className="mt-1.5 display-3 text-foreground">{product.name}</h3>
        </div>
        <span
          aria-hidden
          className="mt-1 grid size-9 shrink-0 place-items-center rounded-full border border-cocoa/15 text-primary transition-colors duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"
        >
          <ArrowUpRight className="size-4" />
        </span>
      </div>

      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {product.shortDescription}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="rounded-full bg-secondary px-3 py-1 meta font-semibold text-foreground">
          {product.heroIngredient}
        </span>
        <span className="text-sm font-semibold text-primary underline-offset-4 group-hover:underline">
          {statusCta[product.status]}
        </span>
      </div>
    </Link>
  );
}
