import Link from "next/link";
import { AlertTriangle, ArrowLeft, Printer } from "lucide-react";
import { requireRestaurantUser } from "@/lib/requireRestaurantUser";
import PrintQRCodesClient from "./PrintQRCodesClient";

type RestaurantTable = {
  id: string;
  name: string;
  is_active: boolean;
  qr_token: string;
};

export default async function PrintTablesPage() {
  const { restaurant, supabase } = await requireRestaurantUser();

  const { data: tables, error } = await supabase
    .from("restaurant_tables")
    .select("id, name, is_active, qr_token")
    .eq("restaurant_id", restaurant.id)
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("PRINT TABLES LOAD ERROR:", error);

    return (
      <main className="min-h-screen bg-[var(--color-bg)] px-4 py-6 text-[var(--color-text)]">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
          <div className="w-full rounded-[30px] border border-red-500/25 bg-red-500/10 p-6 text-center shadow-[0_18px_60px_rgba(0,0,0,0.25)]">
            <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-red-500/25 bg-red-500/10 text-red-200">
              <AlertTriangle className="size-7" />
            </div>

            <h1 className="mt-5 font-heading text-4xl font-normal text-red-100">
              Failed to load QR codes
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-red-100/75">
              Active table QR codes could not be loaded. Refresh the page or go
              back to table manager and try again.
            </p>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link
                href="/dashboard/tables"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-500/25 bg-black/20 px-4 text-xs font-black uppercase tracking-[0.14em] text-red-100"
              >
                <ArrowLeft className="size-4" />
                Back to Tables
              </Link>

              <Link
                href="/dashboard/tables/print"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-red-100 px-4 text-xs font-black uppercase tracking-[0.14em] text-red-950"
              >
                Retry
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!tables?.length) {
    return (
      <main className="min-h-screen bg-[var(--color-bg)] px-4 py-6 text-[var(--color-text)]">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
          <div className="w-full rounded-[30px] border border-[var(--color-border)] bg-[var(--color-surface-soft)]/70 p-6 text-center shadow-[0_18px_60px_rgba(0,0,0,0.25)]">
            <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-[var(--color-border-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]">
              <Printer className="size-7" />
            </div>

            <h1 className="mt-5 font-heading text-4xl font-normal">
              No active tables to print
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[var(--color-text-muted)]">
              Only active tables are included in the print sheet. Enable at
              least one table first.
            </p>

            <Link
              href="/dashboard/tables"
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[var(--color-gold)] px-5 text-xs font-black uppercase tracking-[0.14em] text-[var(--color-bg)]"
            >
              <ArrowLeft className="size-4" />
              Back to Tables
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <PrintQRCodesClient
      restaurantName={restaurant.name}
      tables={tables as RestaurantTable[]}
    />
  );
}