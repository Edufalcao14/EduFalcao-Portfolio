/**
 * An item in a screenshot section. Not always an image: the Media collection
 * accepts mp4 and webm, so `mimeType` is what tells the gallery whether to
 * render a picture or a player. `alt` is the one written on the media itself,
 * which is the only description that says what the screen actually shows.
 */
export type Image={
    url:string
    alt?:string
    mimeType?:string
}


/** `layer` groups the badges on a case page. Absent means ungrouped. */
export type TechLayer = 'frontend' | 'backend' | 'tooling'

export type Technology = {
    name: string;
    layer?: TechLayer;
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