import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  action,
  align = "start",
  tone = "light",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  action?: ReactNode;
  align?: "start" | "center";
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <p className={cn("eyebrow", tone === "dark" ? "text-primary-foreground/70" : "text-primary")}>
            {eyebrow}
          </p>
        ) : null}
        <h2 className={cn("mt-3 display-2", tone === "dark" ? "text-primary-foreground" : "text-foreground")}>
          {title}
        </h2>
        {intro ? (
          <p
            className={cn(
              "mt-4 lede",
              tone === "dark" ? "text-primary-foreground/80" : "text-muted-foreground",
            )}
          >
            {intro}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
