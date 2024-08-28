import { cn } from '@/lib/utils'
import React from 'react'


type SectionTitleProps = {
    title : string,
    subtitle : string,
    className?: string
}

export const SectionTitle = ({title , subtitle , className}: SectionTitleProps) => {
  return (
    <div className={cn( 'flex flex-col gap-4',className)}>
        <span className='font-mono text-sm text-emerald-400 text-xl'>.../{subtitle}</span>
        <h3 className='text-3xl font-medium'>{title}</h3>
    </div>
  )
}
