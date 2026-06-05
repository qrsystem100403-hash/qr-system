import { HeroSection } from "./components/site/HeroSection"
import { FeaturedDishes } from "./components/site/FeaturedDishes"
import { MenuPreview } from "./components/site/MenuPreview"
import { SiteFooter } from "./components/site/SiteFooter"
import { SiteHeader } from "./components/site/SiteHeader"
import { TrustBar } from "./components/site/TrustBar"
import { StickyOrderButton } from "./components/site/StickyOrderButton"
import { ExperienceStats } from "./components/site/ExperienceStats"
import { getPublicMenuPreview } from "@/lib/supabase/getPublicMenuPreview"
import { AboutStory } from "./components/site/AboutStory"

export default async function Home() {
  const { items, categories, error } = await getPublicMenuPreview()

  const featuredItems = items.slice(0, 4)

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <SiteHeader />
      <HeroSection />
      <TrustBar />

      <FeaturedDishes
        items={featuredItems}
        error={error}
      />
        <ExperienceStats />
        <AboutStory/>

      <MenuPreview
        items={items}
        categories={categories}
        error={error}
      />

      <SiteFooter />
      <StickyOrderButton />
    </main>
  )
}