export type Technology = {
    name: string;
};

export type ExperienceItemType = {
    projectName: string;
    title: string;
    startDate: string;
    endDate: string;
    experienceText: string;
    technology: Technology[];
};

export type ExperiencePageInfo = {
    mainText:string
    experienceItem: ExperienceItemType[];
};

export type ExperiencePageData = {
    professionalExperience: ExperiencePageInfo;
};
