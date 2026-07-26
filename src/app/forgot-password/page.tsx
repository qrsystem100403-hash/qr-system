"use client";

import { useState } from "react";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    const { error } =
      await supabaseBrowser.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        },
      );

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(
      "Password reset link sent. Please check your email.",
    );

    setEmail("");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-md rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-xl">

        <Link
          href="/login"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-heading)]"
        >
          <ArrowLeft className="size-4" />
          Back to Login
        </Link>

        <h1 className="text-3xl font-bold text-[var(--color-heading)]">
          Forgot Password
        </h1>

        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Enter your email address and we'll send you a password reset link.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--color-heading)]">
              Email Address
            </label>

            <div className="flex h-12 items-center rounded-xl border border-[var(--color-border)] px-4">
              <Mail className="size-5 text-[var(--color-text-soft)]" />

              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="owner@example.com"
                className="ml-3 w-full bg-transparent outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-[var(--color-primary)] font-semibold text-[var(--color-inverse)] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}