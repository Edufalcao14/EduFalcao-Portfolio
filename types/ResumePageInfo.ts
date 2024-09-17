import type { RichTextContent } from '@graphcms/rich-text-types';

export type EducationCard = {
    institution: string;
    degree: string;
    startDate: string | null;
    endDate: string | null;
    amountHours: number | null;
};

export type Social = {
    name: string;
    url: string;
    iconSvg: string; 
};

export type SkillCard = {
    name: string;
    skillIcon: string; 
};

export type AboutMe = {
    aboutmeText: {
        raw: RichTextContent; 
    };
    email: string;
    socialsAboutMe: Social[];
};

export type Skill = {
    skillText: string;
    skillCard: SkillCard[];
};

export type Education = {
    educationText: string;
    educationCard: EducationCard[];
};

export type ResumePageInfo = {
    education: Education;
    aboutMe: AboutMe;
    skill: Skill;
};

export type ResumePageData = {
    resumePage: ResumePageInfo;
};
