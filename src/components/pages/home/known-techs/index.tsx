import React from 'react'
import { SectionTitle } from '@/components/section-title'
import { TbBrandNextjs  } from "react-icons/tb"
import { KnownTech } from './known-tech'


const KnowTechs = () => {
  return (
   <section className='container py-16'>
    <SectionTitle subtitle='Competences' title='Skills' />
    <div className='grid grid-cols-[repeat(auto-fit,minmax(264px,1fr))] gap-3 mt-[60px]'>
      {Array.from({ length:5 }).map((_,index)=>(

        <KnownTech key={index} tech={{
        icon: <TbBrandNextjs size={32} color='white'/>,
        name:'Next.js',
        startDate: '2021-07-23'
      }} />
      
      ))}
    </div>
   </section>
  )
}

export default KnowTechs