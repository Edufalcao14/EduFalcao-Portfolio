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
    iconSvg: string; // Assuming the SVG is returned as a string
};

export type SkillCard = {
    name: string;
    skillIcon: string; // Assuming the icon is returned as a string (SVG content)
};

export type AboutMe = {
    aboutmeText: {
        raw: RichTextContent; // Nested raw field of type RichTextContent
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
