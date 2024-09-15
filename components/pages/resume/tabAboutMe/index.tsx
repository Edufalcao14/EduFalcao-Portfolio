"use client";
import { motion } from "framer-motion";
import React, { useState } from 'react';
import { FaHtml5, FaCss3, FaJs, FaReact, FaGit, FaNodeJs, FaJava } from "react-icons/fa";
import { SiTypescript, SiNextdotjs, SiPostgresql, SiSpringboot, SiDocker } from "react-icons/si";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/UI/tooltip";
import { ScrollArea } from "@/components/UI/scrollarea";
import ParticlesContainer from "@/components/ParticlesContainer";
import { TbBrandGithub, TbBrandLinkedin, TbBrandWhatsapp } from "react-icons/tb";
import { fadeIn } from "@/components/Animations/fadeIn";
import { ResumePageData, ResumePageInfo } from "@/app/types/ResumePageInfo";
import { RichText } from "@/components/rich-text";
import { CMSIcon } from "@/components/cms-icon";
import { Social } from "@/app/types/ResumePageInfo";

const abouta = {
    title: "About me",
    description: "My name is Eduardo Falcão, and I am a Junior Full Stack Developer currently in my final year of a Management IT degree. I have experience in software application development and testing, with proficiency in Java and Spring frameworks for building APIs and integrating with databases such as MySQL and PostgreSQL. I am a quick learner with excellent problem-solving skills, eager to advance my career as a Full-Stack Software Engineer. I am also expanding my knowledge of front-end technologies, including React.js, Next.js, JavaScript, TypeScript, HTML, and CSS. In addition to my academic and professional pursuits, I engage in freelance work, which further hones my skills and allows me to apply my expertise in real-world projects. I am dedicated to delivering high-quality software solutions and committed to achieving my professional goals.",
    info: [
        {
            fieldName: "Name",
            fieldValue: "Eduardo Falcao",
        },
        {
            fieldName: "Nationality",
            fieldValue: "Brazilian",
        },
        {
            fieldName: "Email",
            fieldValue: "eduardosampaiofalcao@gmail.com",
        },
    ]
}
const educationa = {
    title: "Studies",
    description: "I am currently a student in my final year of a Bachelor's degree in IT - Management Informatics at Haute École Léonard de Vinci in Brussels. Additionally, I continuously pursue further studies and additional courses to enhance my knowledge and technical skills, aiming to deliver increasingly complete and efficient products.",
    items: [
        {
            institution: "Haute École Léonard de Vinci",
            degree: "Bachelor's degree in It Management",
            duration: "09/2021 - 09/2025",
        },
        {
            institution: "Udemy",
            degree: "React , Next.js , web developpement...",
            duration: "98 hours"
        },
        {
            institution: "Udemy",
            degree: "SpringBoot Expert : JPA , RESTFul API , JWT...",
            duration: "38 Hours"
        },
    ]
}

const skillsa = {
    title: "Skills",
    description: "Here are some of the technologies with which I have significant familiarity, as I have been studying, practicing, and applying them in both university and real-world projects.",
    skillList: [
        {
            icon: <FaJava style={{ color: "white" }} />,
            name: "Java",
        },
        {
            icon: <SiNextdotjs style={{ color: "white" }} />,
            name: "Next.js",
        },
        {
            icon: <FaReact style={{ color: "white" }} />,
            name: "React.js",
        },
        {
            icon: <FaNodeJs style={{ color: "white" }} />,
            name: "Node.js",
        },
        {
            icon: <SiTypescript style={{ color: "white" }} />,
            name: "Typescript",
        },

        {
            icon: <SiPostgresql style={{ color: "white" }} />,
            name: "PostgreSQL",
        },
        {
            icon: <SiSpringboot style={{ color: "white" }} />,
            name: "SpringBoot",
        },
        {
            icon: <FaJs style={{ color: "white" }} />,
            name: "javascript",
        },

        {
            icon: <FaHtml5 style={{ color: "white" }} />,
            name: "html 5",
        },
        {
            icon: <FaCss3 style={{ color: "white" }} />,
            name: "css 3",
        },
        {
            icon: <FaGit style={{ color: "white" }} />,
            name: "Git",
        },
        {
            icon: <SiDocker style={{ color: "white" }} />,
            name: "Docker",
        },
    ]
};


type ResumeSectionProps = {
    resumeInfo: ResumePageInfo
}

export const Resume = ({ resumeInfo }: ResumeSectionProps) => {
    const [activeTab, setActiveTab] = useState("about");
    return (
        <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
        >
            <section className=" container ">
                <div className="flex flex-row pt-32">
                    <Tabs defaultValue="about" className="container flex flex-col xl:flex-row gap-[60px]" value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="flex flex-col w-full max-w-[380px] mx-auto xl:mx-0 gap-6">
                            <TabsTrigger
                                className={`font-mono font-bold text-emerald-900 border-none hover:bg-emerald-600 hover:text-white ${activeTab === "about" ? "bg-emerald-600 text-white" : "bg-white"}`}
                                value="about">
                                About Me
                            </TabsTrigger>
                            <TabsTrigger
                                className={`font-mono text-emerald-900 hover:bg-emerald-600 hover:text-white ${activeTab === "education" ? "bg-emerald-600 text-white" : "bg-white"}`}
                                value="education"
                            >
                                Studies
                            </TabsTrigger>
                            <TabsTrigger
                                className={`font-mono text-emerald-900 hover:bg-emerald-600 hover:text-white ${activeTab === "skills" ? "bg-emerald-600 text-white" : "bg-white"}`}
                                value="skills"
                            >
                                Skills
                            </TabsTrigger>
                        </TabsList>
                        <div className="min-h-[70vh] w-full ">
                            <TabsContent value="about" className="w-full text-center xl:text-left pb-10">
                                <motion.div
                                    variants={fadeIn("down", 0.4)}
                                    initial="hidden"
                                    animate="show"
                                    exit="hidden"
                                    className="">
                                    <div className="flex flex-col">
                                        <div className="flex flex-col gap-[30px]">
                                            <h3 className="text-4xl font-bold">About Me</h3>
                                            <div className="max-w-[600px] text-gray-300 mx-auto xl:mx-0"> <RichText content={resumeInfo.aboutMe.aboutmeText.raw} /></div>
                                            <ul className="grid grid-cols-1 xl:grid-cols-2 gap-y-6 max-w-[620px] mx-auto xl:mx-0">
                                                {abouta.info.map((item, index) => {
                                                    return <li key={index} className="flex items-center justify-center xl:justify-start gap-4 ">
                                                        <span className="text-white/60">{item.fieldName}</span>
                                                        <span className="text-xl">{item.fieldValue}</span>
                                                    </li>
                                                })}
                                            </ul>
                                        </div>
                                        <ul className="flex justify-center py-8 px-12 flex-row ">
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
                                </motion.div>
                            </TabsContent>
                            <TabsContent value="education" className="w-full">
                                <motion.div
                                    variants={fadeIn("down", 0.4)}
                                    initial="hidden"
                                    animate="show"
                                    exit="hidden"
                                    className="">
                                    <div className="flex flex-col gap-[30px] text-center xl:text-left pb-16">
                                        <h3 className="text-4xl font-bold">Education</h3>
                                        <p className="max-w-[600px] text-white/60 mx-auto xl:mx-0">{resumeInfo.education.educationText}</p>
                                        <ScrollArea className="h-[320px]">
                                            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
                                                {resumeInfo.education.educationCard.map((card, index) => {
                                                    // Function to format date in day/month/year format
                                                    const formatDate = (dateString : string) => {
                                                        const date = new Date(dateString);
                                                        return date.toLocaleDateString('en-GB'); // en-GB formats it as day/month/year
                                                    };

                                                    return (
                                                        <li key={index} className="bg-[#232329] lg:h-[134px] h-[164px] py-4 px-8 rounded-xl flex flex-col justify-center items-center lg:items-start gap-1">
                                                            {card.startDate && card.endDate ? (
                                                                <span className="text-accent">{formatDate(card.startDate)} - {formatDate(card.endDate)}</span>
                                                            ) : (
                                                                <span className="text-accent">{card.amountHours} Hours</span>
                                                            )}

                                                            <h3 className="text-xl max-w-[260px] min-h-[60px] text-center lg-text-left">{card.degree}</h3>
                                                            <div className="flex items-center gap-3">
                                                                <p className="text-white/60 ">{card.institution}</p>
                                                            </div>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </ScrollArea>
                                    </div>
                                </motion.div>
                            </TabsContent>
                            <TabsContent value="skills" className="w-full">
                                <motion.div
                                    variants={fadeIn("down", 0.4)}
                                    initial="hidden"
                                    animate="show"
                                    exit="hidden"
                                    className="">
                                    <div className="flex flex-col gap-[30px] pb-16">
                                        <div className=" flex flex-col gap-[30px] text-center xl:text-left">
                                            <h3 className="text-4xl font-bold">Skills</h3>
                                            <p className="max-w-[600px] text-white/60 mx-auto xl:mx-0 ">{resumeInfo.skill.skillText}</p>
                                        </div>
                                        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 xl:gap-[30px]">
                                            {resumeInfo.skill.skillCard.map((skill, index) => {
                                                return <li key={index}>
                                                    <TooltipProvider delayDuration={100}>
                                                        <Tooltip>
                                                            <TooltipTrigger className="w-full h-[100px] border  border-emerald-600 rounded-xl flex justify-center items-center group">
                                                                <div className="text-6xl group-hover:text-accent transition-all duration-300">
                                                                    <CMSIcon icon={skill.skillIcon} />
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p className="capitalize ">{skill.name}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </li>
                                            })}
                                        </ul>
                                    </div>
                                </motion.div>
                            </TabsContent>
                        </div>
                    </Tabs>
                    <ParticlesContainer />
                </div>
            </section >
        </motion.div>
    );
};