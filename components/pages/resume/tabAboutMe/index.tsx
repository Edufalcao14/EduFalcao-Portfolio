import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/UI/tooltip"
import { ResumePageInfo } from "@/types/ResumePageInfo"
import { RichText } from "@/components/rich-text"
import { CMSIcon } from "@/components/cms-icon"
import { Social } from "@/types/ResumePageInfo"
import { SlideInView } from "@/components/UI/slide-in-view"

const aboutInfo = [
    { fieldName: "Name", fieldValue: "Eduardo Falcao" },
    { fieldName: "Nationality", fieldValue: "Brazilian" },
    { fieldName: "Email", fieldValue: "eduardosampaiofalcao@gmail.com" },
]

type ResumeSectionProps = {
    resumeInfo: ResumePageInfo
}

export const Resume = ({ resumeInfo }: ResumeSectionProps) => {
    return (
        <SlideInView>
            <section className="container">
                <div className="flex flex-row pt-32">
                    <Tabs defaultValue="about" className="container flex flex-col xl:flex-row xl:items-center gap-[60px]">
                        <TabsList className="flex flex-col w-full max-w-[380px] mx-auto xl:mx-0 xl:-translate-y-16 gap-6">
                            <TabsTrigger
                                className="font-mono font-bold text-emerald-900 border-none hover:bg-emerald-600 hover:text-white bg-white data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                                value="about"
                            >
                                About Me
                            </TabsTrigger>
                            <TabsTrigger
                                className="font-mono text-emerald-900 hover:bg-emerald-600 hover:text-white bg-white data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                                value="education"
                            >
                                Studies
                            </TabsTrigger>
                            <TabsTrigger
                                className="font-mono text-emerald-900 hover:bg-emerald-600 hover:text-white bg-white data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                                value="skills"
                            >
                                Skills
                            </TabsTrigger>
                        </TabsList>
                        <div className="min-h-[70vh] w-full backdrop-blur-sm rounded-2xl p-6">
                            <TabsContent value="about" className="w-full text-center xl:text-left pb-10">
                                <div className="tab-panel-fade flex flex-col">
                                    <div className="flex flex-col gap-[30px]">
                                        <h3 className="text-4xl font-bold">About Me</h3>
                                        <div className="max-w-[600px] text-gray-300 mx-auto xl:mx-0">
                                            <RichText content={resumeInfo.aboutMe.aboutmeText.raw} />
                                        </div>
                                        <ul className="grid grid-cols-1 xl:grid-cols-2 gap-y-6 max-w-[620px] mx-auto xl:mx-0">
                                            {aboutInfo.map((item, index) => (
                                                <li key={index} className="flex items-center justify-center xl:justify-start gap-4">
                                                    <span className="text-white/60">{item.fieldName}</span>
                                                    <span className="text-xl">{item.fieldValue}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <ul className="flex justify-center py-8 px-12 flex-row">
                                        {resumeInfo.aboutMe.socialsAboutMe.map((contact: Social) => (
                                            <a
                                                href={contact.url}
                                                key={`contact-${contact.name}`}
                                                target="_blank"
                                                className="hover:text-emerald-400 transition-colors px-4"
                                                rel="noreferrer"
                                            >
                                                <CMSIcon icon={contact.iconSvg} />
                                            </a>
                                        ))}
                                    </ul>
                                </div>
                            </TabsContent>
                            <TabsContent value="education" className="w-full">
                                <div className="tab-panel-fade flex flex-col gap-[30px] text-center xl:text-left pb-16">
                                    <h3 className="text-4xl font-bold">Education</h3>
                                    <p className="max-w-[600px] text-white/60 mx-auto xl:mx-0">{resumeInfo.education.educationText}</p>
                                    <ul className="flex flex-col gap-5">
                                        {resumeInfo.education.educationCard.map((card, index) => {
                                            const formatDate = (dateString: string) => {
                                                const date = new Date(dateString)
                                                return date.toLocaleDateString('en-GB')
                                            }

                                            return (
                                                <li key={index} className="bg-[#030712]/60 backdrop-blur-sm w-full rounded-2xl px-8 py-6 flex flex-col gap-2 border border-white/10 hover:border-emerald-600/40 transition-colors duration-300">
                                                    <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-1">
                                                        <h3 className="text-xl font-semibold text-white">{card.degree}</h3>
                                                        <div className="flex items-center gap-2 text-sm text-emerald-400 font-mono shrink-0">
                                                            {card.startDate || card.endDate ? (
                                                                <>
                                                                    {card.startDate && <span>{formatDate(card.startDate)}</span>}
                                                                    {card.startDate && card.endDate && <span className="text-white/30">—</span>}
                                                                    {card.endDate && <span>{formatDate(card.endDate)}</span>}
                                                                </>
                                                            ) : card.amountHours ? (
                                                                <span>{card.amountHours} Hours</span>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    {card.description && (
                                                        <p className="text-white/70 text-sm leading-relaxed">{card.description}</p>
                                                    )}
                                                    <p className="text-white/40 text-xs">{card.institution}</p>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </TabsContent>
                            <TabsContent value="skills" className="w-full">
                                <div className="tab-panel-fade flex flex-col gap-[30px] pb-16">
                                    <div className="flex flex-col gap-[30px] text-center xl:text-left">
                                        <h3 className="text-4xl font-bold">Skills</h3>
                                        <p className="max-w-[600px] text-white/60 mx-auto xl:mx-0">{resumeInfo.skill.skillText}</p>
                                    </div>
                                    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 xl:gap-[30px]">
                                        {resumeInfo.skill.skillCard.map((skill, index) => (
                                            <li key={index}>
                                                <TooltipProvider delayDuration={100}>
                                                    <Tooltip>
                                                        <TooltipTrigger className="w-full h-[100px] border border-emerald-600 rounded-xl flex justify-center items-center group">
                                                            <div className="text-6xl group-hover:text-accent transition-all duration-300">
                                                                <CMSIcon icon={skill.skillIcon} />
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p className="capitalize">{skill.name}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </section>
        </SlideInView>
    )
}
