import { HeroSection } from "@/components/pages/home/hero-section";
import { fetchHygraphQuery } from "@/pages/api/fetch-hygraph-query";
import { HomePageData } from "@/types/HomePageInfo";
import { HOME_QUERY } from "@/lib/queries/home";

const getPageData = async (): Promise<HomePageData> => {
  return fetchHygraphQuery(HOME_QUERY);
}

export default async function Home() {
  const { page: pageData } = await getPageData();
  return (
    <>
      <HeroSection homeInfo={pageData} />
    </>
  )
}
