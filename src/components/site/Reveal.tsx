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

    // Already on screen at mount — never hide it.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setShown(true);
      return;
    }

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
      { rootMargin: "0px 0px -5% 0px", threshold: 0 },
    );
    observer.observe(node);

    // Safety net: content is never allowed to stay invisible.
    const onScroll = () => {
      const r = node.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        setShown(true);
        observer.disconnect();
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);


  const visible = !armed || shown;

  return (
    <Tag
      ref={ref}
      style={{
        ...(delay && !shown ? { transitionDelay: `${delay}ms` } : null),
        // Inline styles guarantee content is visible once revealed, regardless
        // of utility class ordering.
        ...(visible
          ? { opacity: 1, transform: "none", filter: "none", clipPath: "none" }
          : null),
      }}
      className={cn(armed && variantClass[variant], armed && shown && "reveal-in", className)}
    >
      {children}
    </Tag>
  );
}

