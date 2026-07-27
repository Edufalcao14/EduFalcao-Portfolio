import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';

export type Technology = {
    name: string;
};

export type ExperienceProject = {
    name: string;
    descriptor: string | null;
    bullets: SerializedEditorState | null;
    /** This product's own stack. Empty means the role-level stack speaks for it. */
    stack: Technology[];
    caseSlug: string | null;
};

export type ExperienceItemType = {
    projectName: string;
    title: string;
    location: string | null;
    startDate: string;
    endDate: string | null;
    experienceText: {
        raw: SerializedEditorState;
    } | null;
    /** One role can cover several products; each renders as its own block. */
    projects: ExperienceProject[];
    technology: Technology[];
};

export type ExperiencePageInfo = {
    mainText:string
    experienceItem: ExperienceItemType[];
};

export type ExperiencePageData = {
    professionalExperience: ExperiencePageInfo;
};
