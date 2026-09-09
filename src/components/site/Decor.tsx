import type { CSSProperties, ReactNode } from "react";
import { Float } from "./Motion";
import { cn } from "@/lib/utils";

/**
 * Hey! You decorative graphic language.
 *
 * Organic blobs, bursts, sparks, hearts and accent strokes drawn from the
 * brand palette. Every element is decorative only: `aria-hidden`, never
 * focusable and never carrying information.
 */

export type DecorTone =
  | "purple"
  | "purple-deep"
  | "orange"
  | "orange-bright"
  | "lime"
  | "gold"
  | "cream"
  | "cocoa";

const fill: Record<DecorTone, string> = {
  purple: "var(--hey-you-purple)",
  "purple-deep": "var(--hey-you-purple-deep)",
  orange: "var(--hey-you-orange)",
  "orange-bright": "var(--hey-you-orange-bright)",
  lime: "var(--hey-you-lime)",
  gold: "var(--hey-you-gold)",
  cream: "var(--hey-you-cream)",
  cocoa: "var(--hey-you-chocolate)",
};

type BaseProps = {
  tone?: DecorTone;
  className?: string;
  style?: CSSProperties;
  opacity?: number;
};

const hidden = { "aria-hidden": true as const };

/** Soft organic colour field — used behind imagery and headlines. */
export function HeyYouBlob({
  tone = "purple",
  className,
  style,
  opacity = 1,
  shape = "a",
  blur = false,
}: BaseProps & { shape?: "a" | "b" | "c"; blur?: boolean }) {
  return (
    <span
      {...hidden}
      className={cn(
        "pointer-events-none absolute block",
        shape === "a" && "blob-a",
        shape === "b" && "blob-b",
        shape === "c" && "blob-c",
        blur && "blur-3xl",
        className,
      )}
      style={{ background: fill[tone], opacity, ...style }}
    />
  );
}

/** Small radiating teardrops — the Hey! You "pop". */
export function HeyYouBurst({ tone = "orange", className, style, opacity = 1 }: BaseProps) {
  return (
    <svg
      {...hidden}
      viewBox="0 0 64 64"
      className={cn("pointer-events-none", className)}
      style={{ opacity, ...style }}
      focusable="false"
    >
      <g fill={fill[tone]}>
        <path d="M32 2c3 8 3 14 0 20-3-6-3-12 0-20Z" />
        <path d="M62 32c-8 3-14 3-20 0 6-3 12-3 20 0Z" />
        <path d="M32 62c-3-8-3-14 0-20 3 6 3 12 0 20Z" />
        <path d="M2 32c8-3 14-3 20 0-6 3-12 3-20 0Z" />
      </g>
    </svg>
  );
}

/** A single teardrop spark. */
export function HeyYouSpark({ tone = "lime", className, style, opacity = 1 }: BaseProps) {
  return (
    <svg
      {...hidden}
      viewBox="0 0 24 32"
      className={cn("pointer-events-none", className)}
      style={{ opacity, ...style }}
      focusable="false"
    >
      <path d="M12 0c7 11 12 16 12 21a12 12 0 0 1-24 0C0 16 5 11 12 0Z" fill={fill[tone]} />
    </svg>
  );
}

/** Rounded brand heart. */
export function HeyYouHeart({ tone = "lime", className, style, opacity = 1 }: BaseProps) {
  return (
    <svg
      {...hidden}
      viewBox="0 0 32 30"
      className={cn("pointer-events-none", className)}
      style={{ opacity, ...style }}
      focusable="false"
    >
      <path
        d="M16 29S1.5 20.4 1.5 10.9A8.4 8.4 0 0 1 16 5.3 8.4 8.4 0 0 1 30.5 11C30.5 20.4 16 29 16 29Z"
        fill={fill[tone]}
      />
    </svg>
  );
}

/** Hand-drawn-feeling underline / connecting stroke. */
export function HeyYouAccent({ tone = "cocoa", className, style, opacity = 1 }: BaseProps) {
  return (
    <svg
      {...hidden}
      viewBox="0 0 160 14"
      preserveAspectRatio="none"
      className={cn("pointer-events-none", className)}
      style={{ opacity, ...style }}
      focusable="false"
    >
      <path
        d="M3 10C34 3 74 2 157 6"
        fill="none"
        stroke={fill[tone]}
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Larger organic silhouette for section backgrounds. */
export function HeyYouOrganicShape({ tone = "cream", className, style, opacity = 1 }: BaseProps) {
  return (
    <svg
      {...hidden}
      viewBox="0 0 200 200"
      className={cn("pointer-events-none", className)}
      style={{ opacity, ...style }}
      focusable="false"
    >
      <path
        d="M158 34c19 20 27 52 18 78s-34 46-63 53-60 1-77-18-19-52-6-79 41-52 69-54 40 0 59 20Z"
        fill={fill[tone]}
      />
    </svg>
  );
}

/**
 * Positions a decorative element and gives it a slow float.
 * Pass Tailwind positioning classes; motion respects reduced-motion.
 */
export function HeyYouFloatingDecoration({
  children,
  className,
  amplitude = 12,
  drift = 6,
  rotate = 3,
  duration = 10,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  amplitude?: number;
  drift?: number;
  rotate?: number;
  duration?: number;
  delay?: number;
}) {
  return (
    <Float
      amplitude={amplitude}
      drift={drift}
      rotate={rotate}
      duration={duration}
      delay={delay}
      className={cn("pointer-events-none absolute select-none", className)}
    >
      {children}
    </Float>
  );
}
