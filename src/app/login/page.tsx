import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="absolute inset-0">
        <img
          src="/images/restaurant-hero.png"
          alt="Restaurant background"
          className="h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-black/72" />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[var(--color-bg)]/90 to-black" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-6 sm:px-5 sm:py-10">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-text-muted)] transition hover:text-[var(--color-gold)] sm:mb-5 sm:text-xs"
          >
            <ArrowLeft className="size-4" />
            Back to website
          </Link>

          <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)]/82 p-5 shadow-[var(--shadow-soft)] backdrop-blur-2xl sm:rounded-[28px] sm:p-7">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--color-border-gold)] bg-[var(--color-gold)] sm:size-14">
                <Image
                  src="/images/logo.png"
                  alt="Friends Cafe logo"
                  width={44}
                  height={44}
                  className="h-10 w-10 object-contain sm:h-11 sm:w-11"
                  priority
                />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[var(--color-gold)] sm:text-xs">
                  Owner Access
                </p>
                <h1 className="mt-1 truncate font-heading text-2xl font-normal leading-none sm:text-3xl">
                  Restaurant Login
                </h1>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-black/30 p-4 sm:mt-6">
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[var(--color-gold)]" />
                <p className="text-xs leading-6 text-[var(--color-text-muted)] sm:text-sm">
                  Sign in to manage live orders, menu availability, payments and
                  restaurant operations.
                </p>
              </div>
            </div>

            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}