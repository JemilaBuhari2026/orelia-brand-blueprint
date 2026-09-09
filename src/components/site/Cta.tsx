import type { ComponentProps, ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "onDark" | "quiet" | "energy";
type Size = "md" | "lg";

const base =
  "group/cta relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full text-sm font-semibold tracking-tight transition-[background-color,color,box-shadow,transform,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:pointer-events-none disabled:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:hover:-translate-y-0.5 active:translate-y-0";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-soft hover:bg-primary-deep hover:shadow-lift",
  secondary:
    "border-2 border-cocoa/20 bg-transparent text-foreground hover:border-primary hover:bg-primary/8",
  onDark:
    "bg-accent text-accent-foreground shadow-soft hover:bg-accent-bright hover:shadow-lift",
  energy:
    "bg-lime text-lime-foreground shadow-soft hover:bg-gold hover:shadow-lift",
  quiet:
    "px-0 text-primary underline-offset-4 hover:underline motion-safe:hover:translate-x-0.5 motion-safe:hover:-translate-y-0",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-6 py-3",
  lg: "min-h-12 px-8 py-3.5 text-[0.95rem]",
};

export function ctaClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], variant === "quiet" ? "min-h-11" : sizes[size], className);
}

export function CtaLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size; children: ReactNode }) {
  return (
    <Link className={ctaClass(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}

export function CtaButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return (
    <button className={ctaClass(variant, size, className)} {...props}>
      {children}
    </button>
  );
}
