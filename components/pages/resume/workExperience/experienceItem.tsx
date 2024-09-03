import { IoCodeWorkingOutline } from "react-icons/io5";
import { TechBagde } from "@/components/tech-bagde";
import React from "react";


export const ExperienceItem = () => {

    return (
        <div className="grid grid-cols-[40px,1fr] gap-4 md:gap-10">
            <div className="flex flex-col items-center gap-4">
                <div className="rounded-full border border-gray-500  ">
                    <IoCodeWorkingOutline className="rounded-full p-1" style={{ width: 40, height: 40, color: 'rgb(52,211,153)' }} />
                </div>
                <div className="h-full w-[1px] bg-gray-700">
                </div>
            </div>
            <div>
                <div className="flex flex-col gap-2 text-sm sm:text-base">
                    <a href="" target="_blank" className="text-gray-500 hover:text-emerald-500 transition-colors">
                        @ Mr.Falcao
                    </a>
                    <h4 className="text-gray-300"> Freelancer Full Stack Developer</h4>
                    <span className="text-gray-500">15/07/2023 - 15/07/2023</span>
                    <p className="text-gray-400">
                        I developed a professional landing page for a company in the construction industry using React, serving as a showcase for their services. The page allows clients to schedule appointments directly with my client via an integrated contact form on the site.
                    </p>
                </div>
                <p className="text-gray-400 text-sm mb-3 mt-6 font-semibold">Technologies used</p>
                <div className="flex gap-2 gap-y-3 flex-wrap lg:max-w-[350px] mb-8">
                    <TechBagde name="Next.js" />
                    <TechBagde name="Sass" />
                    <TechBagde name="Typescript" />
                    <TechBagde name="HTML" />
                    <TechBagde name="CSS" />
                </div>
            </div>
        </div>
    )
}