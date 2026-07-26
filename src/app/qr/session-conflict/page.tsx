import Link from "next/link";
import { AlertTriangle, ArrowLeft, UtensilsCrossed } from "lucide-react";


export default function SessionConflictPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-bg)] px-4 py-8 text-[var(--color-text)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,182,76,0.12),transparent_35%),linear-gradient(180deg,var(--color-bg),var(--color-bg-deep))]" />

      <div className="relative w-full max-w-md overflow-hidden rounded-[34px] border border-[var(--color-border-gold)]/25 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-8 text-center shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl">

        <div className="mx-auto flex size-20 items-center justify-center rounded-3xl border border-yellow-500/30 bg-yellow-500/10">
          <AlertTriangle className="size-10 text-yellow-300" />
        </div>

        <p className="mt-6 text-[11px] font-black uppercase tracking-[0.28em] text-[var(--color-gold)]">
          Active Dining Session
        </p>

        <h1 className="mt-3 font-heading text-4xl leading-none tracking-[-0.04em]">
          Another Table Is Already Active
        </h1>

        <p className="mt-5 text-sm leading-7 text-[var(--color-text-muted)]">
          This device already has an active dining session at another table.
          Please complete that session before scanning a different QR code.
        </p>

        <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left">
          <div className="flex items-start gap-3">
            <UtensilsCrossed className="mt-0.5 size-5 text-[var(--color-gold)]" />

            <div>
              <p className="font-bold">
                Why am I seeing this?
              </p>

              <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                One browser can have only one active dining session.
                This prevents accidental orders from multiple tables using
                the same phone.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <Link
            href="/"
            className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[var(--color-gold)] text-sm font-black uppercase tracking-[0.14em] text-[var(--color-bg)] transition hover:opacity-90"
          >
            Return Home
          </Link>

          <Link
  href="/"
  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] text-sm font-bold text-[var(--color-text)] transition hover:border-[var(--color-border-gold)]"
>
  <ArrowLeft className="size-4" />
  Go Back
</Link>
        </div>
      </div>
    </main>
  );
}