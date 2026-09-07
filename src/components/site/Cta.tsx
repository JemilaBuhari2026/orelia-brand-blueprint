import type { ComponentProps, ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "onDark" | "quiet";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold tracking-tight transition-[background-color,color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:pointer-events-none disabled:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-2";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-soft hover:bg-primary/92 hover:shadow-lift active:translate-y-px",
  secondary:
    "border border-cocoa/20 bg-transparent text-foreground hover:border-cocoa/35 hover:bg-secondary active:translate-y-px",
  onDark:
    "bg-accent text-accent-foreground shadow-soft hover:bg-accent/92 hover:shadow-lift active:translate-y-px",
  quiet:
    "px-0 text-primary underline-offset-4 hover:underline",
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
