import type { RichTextContent } from '@graphcms/rich-text-types'

export type Social = {
    url:string ,
    iconSvg: string,
}

export type HomePageInfo={
    introduction:{
        raw:RichTextContent;
    }
    socials: Social[]
}

export type HomePageData={
    page:HomePageInfo;
}


