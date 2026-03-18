import { Suspense } from "react"
import { HeroSection } from "@/components/pages/home/hero-section"
import { fetchHygraphQuery } from "@/pages/api/fetch-hygraph-query"
import { HomePageData } from "@/types/HomePageInfo"
import { HOME_QUERY } from "@/lib/queries/home"

async function HomeContent() {
  const data = await fetchHygraphQuery<HomePageData>(HOME_QUERY)
  return <HeroSection homeInfo={data.page} />
}

export default function Home() {
  return (
    <Suspense fallback={<div className="h-screen" />}>
      <HomeContent />
    </Suspense>
  )
}
