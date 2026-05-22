"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setErrorMessage("");
    setLoading(true);

    try {
      const { error } = await supabaseBrowser.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      window.location.href = "/dashboard";
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      setErrorMessage("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="mt-7 space-y-5">
      {errorMessage && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </div>
      )}

      <div>
        <label className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-text-soft)]">
          Email
        </label>

        <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-black/40 px-4 transition focus-within:border-[var(--color-border-gold)]">
          <Mail className="size-4 text-[var(--color-gold)]" />

          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 w-full bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-soft)]"
            placeholder="owner@example.com"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-text-soft)]">
          Password
        </label>

        <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-black/40 px-4 transition focus-within:border-[var(--color-border-gold)]">
          <Lock className="size-4 text-[var(--color-gold)]" />

          <input
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-soft)]"
            placeholder="••••••••"
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-[var(--color-text-soft)] transition hover:text-[var(--color-gold)]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !email || !password}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-gold)] px-5 text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--color-bg)] shadow-[0_18px_45px_rgba(211,181,74,0.22)] transition hover:-translate-y-0.5 hover:brightness-110 disabled:pointer-events-none disabled:opacity-50"
      >
        {loading && <Loader2 className="size-4 animate-spin" />}
        {loading ? "Signing in..." : "Login"}
      </button>
    </form>
  );
}