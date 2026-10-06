import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import logoAsset from "@/assets/heyyou-logo-master.png.asset.json";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Hey! You Wellness" },
      { name: "description", content: "Sign in to Hey! You Wellness with Google or email." },
      { property: "og:title", content: "Sign in — Hey! You Wellness" },
      { property: "og:description", content: "Sign in to Hey! You Wellness with Google or email." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    const cleanEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Your password needs at least 8 characters.");
      return;
    }
    setBusy(true);
    if (mode === "signup") {
      const { data, error: err } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      setBusy(false);
      if (err) {
        setError(/registered|exists/i.test(err.message) ? "An account with this email already exists. Try signing in." : err.message);
        return;
      }
      if (!data.session) {
        setNotice("Check your email to confirm your account, then sign in.");
        setMode("signin");
        setPassword("");
      }
      return;
    }
    const { error: err } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
    setBusy(false);
    if (err) {
      setError(
        /confirm/i.test(err.message)
          ? "Please confirm your email first — check your inbox for the link."
          : "That email and password don't match. Please try again.",
      );
    }
  }

  useEffect(() => {
    if (!loading && user) navigate({ to: "/", replace: true });
  }, [user, loading, navigate]);

  async function handleGoogle() {
    setError(null);
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        const msg = String(result.error.message ?? result.error);
        setError(
          /cancel|closed|denied/i.test(msg)
            ? "Google sign-in was cancelled. You can try again whenever you're ready."
            : "We couldn't sign you in with Google. Please try again.",
        );
        setBusy(false);
        return;
      }
      if (result.redirected) return;
      navigate({ to: "/", replace: true });
    } catch {
      setError("We couldn't sign you in with Google. Please try again.");
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-16">
      <div className="w-full max-w-sm text-center">
        <Link to="/" aria-label="Hey! You Wellness home" className="inline-block">
          <img src={logoAsset.url} alt="Hey! You Wellness" width={788} height={1134} className="mx-auto h-20 w-auto" />
        </Link>
        <h1 className="mt-8 font-display text-3xl text-foreground">Welcome</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to continue with Hey! You Wellness.</p>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={busy || loading}
          className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full border border-border bg-card px-5 py-3.5 text-sm font-semibold text-foreground shadow-hairline transition-colors hover:bg-secondary disabled:opacity-60"
        >
          {busy ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <GoogleMark />}
          {busy ? "Connecting to Google…" : "Continue with Google"}
        </button>

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleEmail} noValidate className="space-y-3 text-left">
          <label className="block text-sm font-medium text-foreground">
            Email
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <label className="block text-sm font-medium text-foreground">
            Password
            <input
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <button
            type="submit"
            disabled={busy || loading}
            className="w-full rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {mode === "signup" ? "Create account" : "Sign in with email"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode((m) => (m === "signin" ? "signup" : "signin"));
            setError(null);
            setNotice(null);
          }}
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>

        <p role="alert" aria-live="polite" className="mt-4 min-h-5 text-sm text-destructive">
          {error}
        </p>
        {notice ? (
          <p role="status" className="text-sm text-foreground">
            {notice}
          </p>
        ) : null}

        <Link to="/" className="mt-6 inline-block text-sm font-medium text-muted-foreground hover:text-foreground">
          ← Back to the shop
        </Link>
      </div>
    </main>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="size-5" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}
