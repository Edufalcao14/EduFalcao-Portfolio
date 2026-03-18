import type { RichTextContent } from '@graphcms/rich-text-types';

export type Technology = {
    name: string;
};

export type ExperienceItemType = {
    projectName: string;
    title: string;
    startDate: string;
    endDate: string | null;
    experienceText: {
        raw: RichTextContent;
    } | null;
    technology: Technology[];
};

export type ExperiencePageInfo = {
    mainText:string
    experienceItem: ExperienceItemType[];
};

export type ExperiencePageData = {
    professionalExperience: ExperiencePageInfo;
};
