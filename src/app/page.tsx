import { HeroSection } from "./components/site/HeroSection";
import { MenuPreview } from "./components/site/MenuPreview";
import { SiteFooter } from "./components/site/SiteFooter";
import { SiteHeader } from "./components/site/SiteHeader";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { TrustBar } from "./components/site/TrustBar";
import { StickyOrderButton } from "./components/site/StickyOrderButton";

export default async function Home() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("menu_items")
    .select("id, name, price, image, category, description, is_available")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <SiteHeader />
      <HeroSection />
      <TrustBar/>
      <MenuPreview
        items={data ?? []}
        error={error ? "Check Supabase permissions, table columns, or database connection." : null}
      />
      <SiteFooter />
      <StickyOrderButton/>
    </main>
  );
}