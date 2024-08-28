import Image from "next/image"



export const ProjectCard = () =>{
    return(
        <div className="flex gap-6 lg:gap-12 flex-col lg:flex-gro">
            <div className="w-full h-full">
                <Image
                    width={420}
                    height={304}
                    src="/images/tumb_project.png"
                    alt="Test Thumb list projects"   
                    className="object-cover rounded-lg z-1"             
                />
            </div>
            <div className="flex items-center gap-3 font-medium text-lg text-gray-50">
                <h3>
                     <Image
                     width={20}
                     height={20}
                     alt=""
                     src="/images/icons/project-title-icon.svg"
                    />
                    Mr . Falcao
                </h3>
            </div>
        </div>
    )
}