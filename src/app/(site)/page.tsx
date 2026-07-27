import { Suspense } from "react"
import { HeroSection } from "@/components/pages/home/hero-section"
import { getHomeInfo } from "@/lib/content"

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
