import { ParticlesContainer } from "@/components/ParticlesContainer"
import { HomePageInfo } from '@/types/HomePageInfo'
import { AnimatedHeroContent } from './animated-hero-content'
import { AnimatedProfileImage } from './animated-profile-image'

type HomeSectionProps = {
    homeInfo: HomePageInfo
}

export const HeroSection = ({ homeInfo }: HomeSectionProps) => {
    return (
        <section className="w-full h-screen bg-hero-image bg-cover bg-center bg-no-repeat flex flex-col justify-center overflow-hidden relative">

            <div
                className="absolute inset-0 pointer-events-none opacity-[0.025]"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(52,211,153,1) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,1) 1px, transparent 1px)',
                    backgroundSize: '64px 64px',
                }}
            />

            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

            <div className="container flex items-center justify-between flex-col-reverse md:flex-row relative z-20 gap-2">
                <AnimatedHeroContent homeInfo={homeInfo} />
                <AnimatedProfileImage />
            </div>

            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

            <ParticlesContainer opacityScale={1} positioning="absolute" />
        </section>
    )
}
