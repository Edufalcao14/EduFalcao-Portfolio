import { getRelativeTimeString } from '@/utils/get-relative-time'
import React from 'react'
import { ReactNode } from 'react'

type KnowTechProps = {
    tech:{
        icon: ReactNode,
        name : string,
        startDate : string
    }
}

export const KnownTech = ({tech} : KnowTechProps) => {
    const relativeTime = getRelativeTimeString(new Date(tech.startDate) ,'en-UK' ).replace(' ago' , '');
  return (
    <div className='p-6 rounded-lg bg-gray-600/20 text-gray-400  flex flex-col gap-2 hover:text-emerald-400 hover:bg-gray-600/30 transition transition-all'>
        <div className='flex items-center justify-between'>
        <p className='font-medium'>{tech.name}</p>
        {tech.icon}   
        </div>
        <span>{relativeTime} of experience</span>
    </div>
  )
}


