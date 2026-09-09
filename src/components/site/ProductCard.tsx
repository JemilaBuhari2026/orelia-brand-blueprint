import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { statusCta, statusLabels, type Product } from "@/lib/catalog";
import { HeyYouBlob, HeyYouSpark } from "./Decor";
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
      className={cn(
        "group relative flex h-full flex-col rounded-[1.6rem] p-3 transition-[transform,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none",
        "hover:bg-card hover:shadow-lift focus-visible:bg-card focus-visible:shadow-lift motion-safe:hover:-translate-y-1.5",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[1.35rem] bg-secondary">
        <HeyYouBlob
          tone="lime"
          shape="b"
          opacity={0.55}
          className="-left-10 -top-10 size-32 blur-2xl transition-transform duration-700 group-hover:translate-x-3 group-hover:translate-y-2"
        />
        <img
          src={product.hero.src}
          alt={product.hero.alt}
          loading="lazy"
          width={1024}
          height={1280}
          className="relative aspect-[4/5] w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-focus-visible:scale-[1.06]"
        />
        {showStatus ? (
          <span className="absolute left-4 top-4 rounded-full bg-background/92 px-3 py-1 meta font-semibold text-foreground shadow-soft backdrop-blur-sm">
            {statusLabels[product.status]}
          </span>
        ) : null}
        <HeyYouSpark
          tone="orange"
          className="absolute bottom-4 right-4 h-7 w-5 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
        />
      </div>

      <div className="mt-5 flex items-start justify-between gap-4 px-1">
        <div className="min-w-0">
          <p className="eyebrow text-accent">{product.family}</p>
          <h3 className="mt-1.5 display-3 text-foreground transition-colors duration-300 group-hover:text-primary">
            {product.name}
          </h3>
        </div>
        <span
          aria-hidden
          className="mt-1 grid size-10 shrink-0 place-items-center rounded-full border-2 border-cocoa/12 text-primary transition-[background-color,border-color,color,transform] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground motion-safe:group-hover:rotate-45"
        >
          <ArrowUpRight className="size-4" />
        </span>
      </div>

      <p className="mt-2 max-w-sm px-1 text-sm leading-relaxed text-muted-foreground">
        {product.shortDescription}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 px-1 pb-1">
        <span className="rounded-full bg-lime/35 px-3 py-1 meta font-semibold text-foreground">
          {product.heroIngredient}
        </span>
        <span className="relative text-sm font-semibold text-primary">
          {statusCta[product.status]}
          <span className="absolute -bottom-0.5 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-accent transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
        </span>
      </div>
    </Link>
  );
}
