import Link from "next/link";
import { Lock } from "lucide-react";

export default function OccupiedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-md rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
          <Lock className="h-8 w-8 text-red-400" />
        </div>

        <h1 className="text-3xl font-bold">
          Table Already Occupied
        </h1>

        <p className="mt-3 text-sm text-[var(--color-text-muted)]">
          Another customer is already using this table.
          Please ask the restaurant staff if you want to join this table.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[var(--color-gold)] px-6 font-semibold text-black"
        >
          Back
        </Link>
      </div>
    </main>
  );
}