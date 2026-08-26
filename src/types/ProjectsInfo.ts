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
    /** The sentence beside the images. Optional: a section can be a bare grid. */
    description?: string;
    image: Image[]
};

/** A measured number. `method` is required by the CMS, so it is never absent. */
export type Metric = {
    value: string;
    label: string;
    method: string;
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

    /**
     * The facts rail and the metric band. Everything here is optional except the
     * period, because the screen renders every project and a thin one has to
     * hold: a cell with no value is dropped rather than rendered empty.
     */
    role?: string;
    company?: string;
    periodStart?: string;
    periodEnd?: string;
    kind?: 'mobile' | 'web' | 'academic';
    metrics?: Metric[];
    /** Kept separate from liveUrl so the button row can name each store. */
    appStoreUrl?: string;
    playStoreUrl?: string;
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