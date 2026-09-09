import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "up" | "blur" | "mask";

const variantClass: Record<Variant, string> = {
  up: "reveal",
  blur: "reveal-blur",
  mask: "reveal-mask",
};

/**
 * Level 2 — scroll reveal. Renders fully visible during SSR and for users
 * without JS or with reduced-motion enabled, so content is never hidden.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  variant = "up",
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  variant?: Variant;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = ref.current;
    if (!node) return;

    setArmed(true);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(armed && variantClass[variant], armed && shown && "reveal-in", className)}
    >
      {children}
    </Tag>
  );
}
