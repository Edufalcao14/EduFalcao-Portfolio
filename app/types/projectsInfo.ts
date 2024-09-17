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
};

export type ProjectPageData = {
    projectCard: ProjectCardType
  }

export type ProjectspageStaticData={
    projectCards:{
        slug:string
    }[]
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