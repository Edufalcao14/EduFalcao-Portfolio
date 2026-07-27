export type Image={
    url:string
}


export type Technology = {
    name: string;
};

export type ProjectSection = {
    title: string;
    image: Image[]
};

import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export type ProjectCardType = {
    slug: string;
    projectName: string;
    projectDescription: string;
    githubUrl?: string;
    liveUrl?: string;
    thumbPhoto: {
        url: string;
    };
    projectSection: ProjectSection[];
    technology: Technology[];
    /** Case narrative. Added with the Payload backend; Hygraph had no equivalent. */
    body?: SerializedEditorState | null;
};

export type ProjectPageData = {
    projectCard: ProjectCardType
  }

export type ProjectsPageInfo = {
    mainText:string
    projectCard: ProjectCardType[];
};

export type ProjectsPageData = {
    project: ProjectsPageInfo;
};

export type ProjectsPageStaticData = {
    projectCards: {
      slug: string
    }[]
  }