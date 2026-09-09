import Image from 'next/image'
import { PX_PER_CM, type Artwork } from '@/lib/artworks'
import { ZoomTrigger } from './lightbox'

/** The artist tunes mt/mb/dx against the widest layout, so they scale with it. */
function nudge(px: number) {
  return `calc(${px} * var(--ppc) / ${PX_PER_CM})`
}

/**
 * A work hangs at its real size. Width comes from the painting's own
 * centimetres multiplied by --ppc, the page's pixels-per-centimetre, so a
 * 10x15 stays small next to a 50x70 at every viewport.
 */
export function ArtworkFigure({ art, index }: { art: Artwork; index: number }) {
  const dx = art.dx ?? 0

  return (
    <figure
      className="inline-block w-full break-inside-avoid align-top"
      style={{
        marginTop: nudge(art.mt ?? 0),
        marginBottom: nudge(art.mb ?? 64),
        transform: dx ? `translateX(${nudge(dx)})` : undefined,
      }}
    >
      <div className="max-w-full" style={{ width: `calc(${art.wcm} * var(--ppc))` }}>
        <ZoomTrigger index={index} label={`Look closely at ${art.title}`}>
          <div
            className="relative w-full ring-1 ring-inset ring-[var(--canvas-edge)] transition-shadow duration-200 group-hover:ring-[var(--hairline)]"
            style={{ aspectRatio: art.ratio ?? art.wcm / art.hcm }}
          >
            <Image
              src={art.src || '/placeholder.svg'}
              alt={art.alt}
              fill
              sizes="(max-width: 767px) 90vw, (max-width: 1279px) 400px, 560px"
              priority={index === 0}
              className="object-contain"
            />
          </div>
        </ZoomTrigger>
        <figcaption className="mt-3">
          <span className="block text-[0.9375rem] font-medium leading-snug">{art.title}</span>
          <span className="measure mt-0.5 block text-[0.875rem] text-muted-foreground">
            {art.wcm} × {art.hcm} cm
          </span>
        </figcaption>
      </div>
    </figure>
  )
}
