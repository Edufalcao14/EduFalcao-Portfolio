import { SectionTitle } from "@/components/section-title";
import { Link } from "@/components/Link";
import { HiArrowNarrowLeft } from "react-icons/hi";


export const PageIntroduction = () => {

    return (
        <section className="w-full h-[450px] lg:h[630px] pt-32 flex flex-col items-center justify-center px-2">
            <SectionTitle
                subtitle="Projects"
                title="My Projects"
                className="text-center items-center [&>h3]:text-4xl"
            />
            <div className="flex flex-col items-center">
                <p className="text-gray-400 text-center max-w-[640px] my-6 text-sm sm:text-base">
                    Here, you'll find a selection of my key projects. Feel free to browse and explore each one to learn more about how they were built, the technologies used, and the features implemented. If you're interested in reviewing the code, you're welcome to visit my GitHub, where all the details are available.
                </p>
                <Link href={"/"}>
                        <HiArrowNarrowLeft />
                        Go Back to Home
                </Link>
            </div>
        </section>
    )
}