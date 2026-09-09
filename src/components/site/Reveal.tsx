import { type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "up" | "blur" | "mask";

/**
 * Content wrapper. Previously hid its children until scrolled into view, which
 * could leave sections permanently invisible. Content is now always rendered
 * visible — the props are kept so existing pages need no changes.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay: _delay = 0,
  variant: _variant = "up",
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  variant?: Variant;
  className?: string;
}) {
  return <Tag className={cn(className)}>{children}</Tag>;
}
