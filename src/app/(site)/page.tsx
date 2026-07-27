import { Suspense } from "react"
import { HeroSection } from "@/components/pages/home/hero-section"
import { getHomeInfo } from "@/lib/content"

// Rendered per request: the build container has no database to prerender from.
// Data is cached in src/lib/content.ts and purged on publish.
export const dynamic = 'force-dynamic'

async function HomeContent() {
  const homeInfo = await getHomeInfo()
  return <HeroSection homeInfo={homeInfo} />
}

export default function Home() {
  return (
    <Suspense fallback={<div className="h-screen" />}>
      <HomeContent />
    </Suspense>
  )
}
