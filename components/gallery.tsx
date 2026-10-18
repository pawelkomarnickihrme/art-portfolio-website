import type { Artwork } from '@/lib/artworks'
import { ArtworkFigure } from './artwork-figure'
import { Lightbox } from './lightbox'
import styles from './catalog.module.css'

export function Gallery({ artworks }: { artworks: Artwork[] }) {
  return (
    <section
      aria-label="Works"
      id="works"
      tabIndex={-1}
      className={styles.gallery}
    >
      <Lightbox artworks={artworks}>
        {artworks.length ? artworks.map((art, i) => (
          <ArtworkFigure key={`${art.src}-${i}`} art={art} index={i} />
        )) : <p className={styles.empty}>New works are on their way.</p>}
      </Lightbox>
    </section>
  )
}
