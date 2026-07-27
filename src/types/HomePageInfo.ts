import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export type Social = {
    url:string ,
    iconSvg: string,
}

export type HomePageInfo={
    introduction:{
        raw:SerializedEditorState;
    }
    socials: Social[]
}

export type HomePageData={
    page:HomePageInfo;
}


