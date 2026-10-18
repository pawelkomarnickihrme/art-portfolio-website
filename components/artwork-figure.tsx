import type { CSSProperties } from 'react'
import Image from 'next/image'
import type { Artwork } from '@/lib/artworks'
import { ZoomTrigger } from './lightbox'
import styles from './catalog.module.css'

export function ArtworkFigure({ art, index }: { art: Artwork; index: number }) {
  return (
    <figure className={styles.work}>
      <ZoomTrigger index={index} label={`Look closely at ${art.title || `work ${index + 1}`}`}>
        <div className={styles.surface}>
          <div
            className={styles.canvas}
            style={{
              '--work-width': art.wcm,
              '--work-ratio': art.ratio ?? art.wcm / art.hcm,
            } as CSSProperties}
          >
            <Image
              src={art.src || '/placeholder.svg'}
              alt={art.alt || art.title}
              fill
              sizes="(max-width: 639px) 45vw, (max-width: 1023px) 30vw, (max-width: 1599px) 22vw, 350px"
              priority={index < 4}
              className={styles.image}
            />
          </div>
        </div>
      </ZoomTrigger>
      <figcaption className={styles.caption}>
        <span className={styles.title}>{art.title || 'Untitled'}</span>
        <span className={styles.dimensions}>{art.wcm} × {art.hcm} cm</span>
      </figcaption>
    </figure>
  )
}
