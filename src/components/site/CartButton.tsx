import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

export function CartButton({ className }: { className?: string }) {
  const { count, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={count > 0 ? `Open your bag, ${count} item${count === 1 ? "" : "s"}` : "Open your bag"}
      className={cn(
        "relative grid size-11 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary",
        className,
      )}
    >
      <ShoppingBag className="size-5" aria-hidden />
      {count > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-primary px-1.5 py-0.5 text-[0.65rem] font-bold text-primary-foreground">
          {count}
        </span>
      ) : null}
    </button>
  );
}
