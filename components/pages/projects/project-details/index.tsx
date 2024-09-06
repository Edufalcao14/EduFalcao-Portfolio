import { Button } from "@/components/button"
import { SectionTitle } from "@/components/section-title"
import { TechBagde } from "@/components/tech-bagde"
import { TbBrandGithub } from "react-icons/tb"
import { FiGlobe } from 'react-icons/fi';
import { Link } from "@/components/Link";
import { HiArrowNarrowLeft } from "react-icons/hi";

export const ProjectDetails = () => {
    return (
        <section className="w-full sm:min-h-[750px] flex flex-col items-center justify-end relative pb-10 sm:pb-24 py-24 px-6 overflow-hidden">
            <div className="absolute inset-0 z-[-1]"
                style={{
                    background: 'url(/images/hero-bg.png) no-repeat center/cover , url(/images/tumb_project.png) no-repeat center/cover '
                }}
            />
            <SectionTitle
                subtitle="Projects"
                title="Mr.Falcao"
                className="tex-center items-center sm:[&>h3]:text-4xl"
            />
            <p className="text-gray-400 text-center max-w-[640px] my-4 sm:my-6 text-sm lg:text-base">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam ea corporis saepe adipisci dolorum mollitia earum commodi eveniet perferendis ducimus excepturi, corrupti porro omnis accusamus error nostrum in enim dignissimos, aspernatur assumenda explicabo. Dolorum laboriosam cumque itaque quisquam dolores, nihil dolorem mollitia architecto cupiditate assumenda nostrum quidem ab soluta fugit.
            </p>
            <div className="w-full max-w-[330px] flex flex-wrap gap-2 items-center justify-center">
                <TechBagde name="Next.js " />
                <TechBagde name="Next.js " />
                <TechBagde name="Next.js " />
                <TechBagde name="Next.js " />
                <TechBagde name="Next.js " />
                <TechBagde name="Next.js " />
                <TechBagde name="Next.js " />
            </div>
            <div className="my-6 sm:my-12 flex items-center gap-2 sm:gap-4 flex-col sm:flex-row">
                <a href="https://github.com/Edufalcao14" target="_blank">
                    <Button className="min-w-[180px]" >
                        <TbBrandGithub size={20} />
                        Repository
                    </Button>
                </a>
                <a href="https://github.com/Edufalcao14" target="_blank">
                    <Button className="min-w-[180px]" >
                        <FiGlobe size={20} />
                        Repository
                    </Button>
                </a>
            </div>
        <Link href="/projects">
        <HiArrowNarrowLeft size={18}/>
        Go back to projects
        </Link>

        </section>
    )
}