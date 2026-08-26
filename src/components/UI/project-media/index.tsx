import Image from "next/image"

import type { Image as Media } from "@/types/ProjectsInfo"

/**
 * A project's media, whichever kind it is.
 *
 * The `thumbnail` field accepts a video as well as an image, because a recording
 * of the product says more in five seconds than a screenshot does. Everything
 * that renders a thumbnail therefore has to branch, and it branches here rather
 * than in three places: next/image cannot decode mp4 or webm, and routing one
 * through it returns a 400 and leaves an empty slot.
 *
 * Video always starts on its own, muted and looping: a recording of the product
 * is the argument the page is making, so it should already be moving when the
 * reader arrives. Muted is not a style choice, it is the condition every browser
 * puts on autoplay, and a video that asks to be unmuted is one the reader can
 * unmute from the controls.
 *
 * Two modes, because the same file plays a different part in each spot:
 * - `player` keeps the controls. The hero, where watching is the point and the
 *   reader may want to pause, scrub or turn the sound on.
 * - `poster` drops them. A card is a link, so controls inside it would fight the
 *   click that opens the case.
 */

export const isVideo = (media: Pick<Media, 'mimeType'>): boolean =>
  Boolean(media.mimeType?.startsWith('video/'))

type ProjectMediaProps = {
    media: Media
    alt: string
    width: number
    height: number
    className?: string
    mode?: 'player' | 'poster'
    priority?: boolean
}

export const ProjectMedia = ({
    media,
    alt,
    width,
    height,
    className,
    mode = 'player',
    priority,
}: ProjectMediaProps) => {
    if (isVideo(media)) {
        const player = mode === 'player'
        return (
            <video
                src={media.url}
                width={width}
                height={height}
                className={className}
                // `metadata` would be enough to size the box, but the video is
                // meant to be playing already, so the bytes are wanted anyway.
                preload="auto"
                // playsInline keeps iOS from taking the video fullscreen, which
                // would hijack the page the moment it autoplays.
                playsInline
                muted
                loop
                autoPlay
                controls={player}
                aria-label={media.alt || alt}
            />
        )
    }

    return (
        <Image
            src={media.url}
            width={width}
            height={height}
            className={className}
            priority={priority}
            alt={media.alt || alt}
        />
    )
}
