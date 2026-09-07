import { Link } from "@tanstack/react-router";
import type { Article } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function ArticleCard({
  article,
  size = "md",
  className,
}: {
  article: Article;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <Link
      to="/journal/$slug"
      params={{ slug: article.slug }}
      className={cn(
        "group flex flex-col rounded-2xl border border-border bg-card p-7 transition-[border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-lift",
        className,
      )}
    >
      <p className="eyebrow text-accent">{article.cluster}</p>
      <h3
        className={cn(
          "mt-3 font-display leading-snug text-foreground",
          size === "md" ? "text-2xl" : "text-xl",
        )}
      >
        {article.title}
      </h3>
      {size === "md" ? (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>
      ) : null}
      <p className="mt-auto pt-6 meta text-muted-foreground">{article.readingTime}</p>
    </Link>
  );
}
