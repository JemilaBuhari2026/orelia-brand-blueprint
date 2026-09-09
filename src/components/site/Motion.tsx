import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/**
 * Hey! You motion system.
 *
 * Level 1 — MICRO     : CSS only (see `hy-lift`, button/link variants)
 * Level 2 — REVEAL    : <Reveal /> (Reveal.tsx)
 * Level 3 — FLOAT     : <Float />
 * Level 4 — PARALLAX  : <Parallax />
 * Level 5 — FEATURE   : composed hero moments
 *
 * Everything degrades to a calm, static layout when the visitor asks for
 * reduced motion, and nothing is baked into image files — swap photography
 * freely without touching these components.
 */

export function useReducedMotion() {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

/** True once the viewport is at least `min` px wide (motion budget on mobile). */
export function useMinWidth(min = 768) {
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${min}px)`);
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [min]);

  return wide;
}

/** Level 3 — gentle organic drift. */
export function Float({
  children,
  className,
  amplitude = 12,
  drift = 6,
  rotate = 2,
  duration = 9,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  amplitude?: number;
  drift?: number;
  rotate?: number;
  duration?: number;
  delay?: number;
  as?: ElementType;
}) {
  const reduced = useReducedMotion();

  const style = {
    "--hy-float-y": `${amplitude}px`,
    "--hy-float-x": `${drift}px`,
    "--hy-float-r": `${rotate}deg`,
    "--hy-float-duration": `${duration}s`,
    animationDelay: delay ? `${delay}s` : undefined,
  } as CSSProperties;

  return (
    <Tag className={cn(!reduced && "hy-float", className)} style={reduced ? undefined : style}>
      {children}
    </Tag>
  );
}

/**
 * Level 4 — parallax. Translates the element as it passes the viewport.
 * `speed` is a fraction of scroll distance; negative moves against the scroll.
 * Disabled entirely for reduced motion and on small screens.
 */
export function Parallax({
  children,
  className,
  speed = 0.12,
  desktopOnly = true,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
  desktopOnly?: boolean;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const wide = useMinWidth(768);
  const active = !reduced && (!desktopOnly || wide);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!active) {
      node.style.transform = "";
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const progress = (rect.top + rect.height / 2 - viewport / 2) / viewport;
      node.style.transform = `translate3d(0, ${(progress * speed * viewport).toFixed(2)}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      node.style.transform = "";
    };
  }, [active, speed]);

  return (
    <Tag ref={ref} className={cn(active && "will-change-transform", className)}>
      {children}
    </Tag>
  );
}
