import {RichText as CMSRichText } from '@graphcms/rich-text-react-renderer'
import { ComponentProps } from 'react'

type RichTextProps = ComponentProps <typeof CMSRichText>
export const RichText = ({...props}:RichTextProps) =>{
    return (
        <CMSRichText
        {...props}
        renderers={{
            bold: ({ children }) => (
                <b className='text-gray-50 font-medium'>{children}</b>
            ),
            italic: ({ children }) => (
                <em className='italic'>{children}</em>
            ),
            underline: ({ children }) => (
                <span className='underline'>{children}</span>
            ),
            p: ({ children }) => (
                <p className='mb-2 last:mb-0'>{children}</p>
            ),
            h1: ({ children }) => (
                <h1 className='text-2xl font-bold mb-3'>{children}</h1>
            ),
            h2: ({ children }) => (
                <h2 className='text-xl font-bold mb-2'>{children}</h2>
            ),
            h3: ({ children }) => (
                <h3 className='text-lg font-semibold mb-2'>{children}</h3>
            ),
            ul: ({ children }) => (
                <ul className='list-none space-y-3 my-3'>{children}</ul>
            ),
            ol: ({ children }) => (
                <ol className='list-none space-y-3 my-3'>{children}</ol>
            ),
            li: ({ children }) => (
                <li className='flex items-start gap-3 text-gray-300 leading-relaxed group'>
                    <span className='mt-[7px] shrink-0 flex items-center justify-center'>
                        <span className='w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_1px_rgba(52,211,153,0.6)] group-hover:scale-125 transition-transform duration-200' />
                    </span>
                    <span className='flex-1'>{children}</span>
                </li>
            ),
            list_item_child: ({ children }) => (
                <>{children}</>
            ),
            a: ({ children, href }) => (
                <a href={href} target='_blank' rel='noreferrer' className='text-emerald-400 underline hover:text-emerald-300 transition-colors'>{children}</a>
            ),
        }}
        />
    )
}