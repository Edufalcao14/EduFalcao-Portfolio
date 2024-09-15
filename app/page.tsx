import { HeroSection } from "@/components/pages/home/hero-section";
import { fetchHygraphQuery } from "@/pages/api/fetch-hygraph-query";
import { HomePageData } from "./types/HomePageInfo";
const getPageData = async () :Promise<HomePageData> => {

  const query = `
  query MyQuery {
  page(where:{slug:"home"}) {
    introduction{
      raw
    }
    socials{
      iconSvg
      name
      url
    }
    
  }
}`

  return fetchHygraphQuery(query);
}

export default async function Home() {

const { page : pageData } = await getPageData();

console.log(pageData);
  return (
    <>
      <HeroSection homeInfo={pageData} />
    </>
  )
}