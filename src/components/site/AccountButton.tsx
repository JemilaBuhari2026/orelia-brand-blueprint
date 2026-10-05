import { Link } from "@tanstack/react-router";
import { LogOut, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const base =
  "relative grid size-11 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary";

export function AccountButton({ className }: { className?: string }) {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <span className={cn(base, "opacity-40", className)} aria-hidden><UserRound className="size-5" /></span>;
  }

  if (!user) {
    return (
      <Link to="/auth" aria-label="Sign in" className={cn(base, className)}>
        <UserRound className="size-5" aria-hidden />
      </Link>
    );
  }

  const name = (user.user_metadata?.full_name as string | undefined) ?? user.email ?? "Your account";
  const avatar = user.user_metadata?.avatar_url as string | undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={`Account menu for ${name}`} className={cn(base, className)}>
        {avatar ? (
          <img src={avatar} alt="" className="size-7 rounded-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <span className="grid size-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="truncate text-sm font-medium">{name}</p>
          {user.email && name !== user.email ? (
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={async () => {
            await signOut();
            toast.success("You've been signed out.");
          }}
        >
          <LogOut className="mr-2 size-4" aria-hidden /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
