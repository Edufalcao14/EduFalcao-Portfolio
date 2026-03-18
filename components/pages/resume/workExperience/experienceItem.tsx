import { IoCodeWorkingOutline } from "react-icons/io5"
import { TechBagde } from "@/components/tech-bagde"
import { ExperienceItemType } from "@/types/WorkExperiencesInfo"
import { RichText } from "@/components/rich-text"
import { SlideInView } from "@/components/UI/slide-in-view"

export const ExperienceItem = (experience: ExperienceItemType) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-GB')
    }

    return (
        <SlideInView>
            <div className="grid grid-cols-[40px,1fr] gap-4 md:gap-10">
                <div className="flex flex-col items-center gap-4">
                    <div className="rounded-full border border-gray-500">
                        <IoCodeWorkingOutline className="rounded-full p-1" style={{ width: 40, height: 40, color: 'rgb(52,211,153)' }} />
                    </div>
                    <div className="h-full w-[1px] bg-gray-700">
                    </div>
                </div>
                <div className="backdrop-blur-sm rounded-xl p-4">
                    <div className="flex flex-col gap-2 text-sm sm:text-base">
                        <p className="text-gray-500 hover:text-emerald-500 transition-colors">
                            @ {experience.projectName}
                        </p>
                        <h4 className="text-gray-300">{experience.title}</h4>
                        <span className="text-gray-500">
                            {formatDate(experience.startDate)}{experience.endDate ? ` - ${formatDate(experience.endDate)}` : ' - Present'}
                        </span>
                        {experience.experienceText && (
                            <div className="text-gray-400">
                                <RichText content={experience.experienceText.raw} />
                            </div>
                        )}
                    </div>
                    <p className="text-gray-400 text-sm mb-3 mt-6 font-semibold">Technologies used</p>
                    <div className="flex gap-2 gap-y-3 flex-wrap lg:max-w-[350px] mb-8">
                        {experience.technology.map((item, index) => (
                            <TechBagde key={index} name={item.name} />
                        ))}
                    </div>
                </div>
            </div>
        </SlideInView>
    )
}
