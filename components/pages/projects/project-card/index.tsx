import Image from "next/image";
import { IoMdCode } from "react-icons/io";
import { TechBagde } from "@/components/tech-bagde";
import { Link } from "@/components/Link";
import { HiArrowNarrowRight } from "react-icons/hi";
export const ProjectCard = () => {
    return (
        <div className="flex gap-6 lg:gap-12 flex-col lg:flex-row">
            <div className="w-full h-full">
                <Image
                    width={380}
                    height={200}
                    src="/images/tumb_project.png"
                    alt="Thumbnail Project"
                    className="w-full h-[200px] lg:min-h-full object-cover rounded-lg z-1"
                />
            </div>
            <div className="">
                <h3 className="flex items-center gap-3 font-medium text-lg text-gray-50 ">
                    <IoMdCode style={{ width: 30, height: 30, color: 'rgb(52,211,153)' }} />
                    Mr.Falcao
                </h3>
                <p className="text-gray-400 my-6">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, pariatur, labore at corrupti iusto officiis, temporibus fugit magnam earum laborum tenetur sint sed illum debitis voluptate deserunt qui tempore sapiente voluptatum nesciunt. Exercitationem nihil facere consectetur labore nisi corporis dolorum modi, commodi quo impedit quidem accusamus possimus officia optio ipsa?
                </p>
                <div className="flex gap-x-2 gap-y-3 flex-wrap mb-8 lg:max-w-[350px]">
                    <TechBagde name="Next.js" />
                    <TechBagde name="Next.js" />
                    <TechBagde name="Next.js" />
                    <TechBagde name="Next.js" />
                    <TechBagde name="Next.js" />
                </div>
                <Link href="/projects/bookwise">
                    Check Project
                    <HiArrowNarrowRight />
                    <Image></Image>
                </Link>
            </div>
        </div>

    )
}