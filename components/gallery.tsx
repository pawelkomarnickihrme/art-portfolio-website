import { getArtworks } from '@/lib/content'
import { ArtworkFigure } from './artwork-figure'
import { Lightbox } from './lightbox'

export async function Gallery() {
  const artworks = await getArtworks()

  return (
    <section
      aria-label="Works"
      className="mx-auto mt-24 w-full max-w-[1320px] columns-1 gap-x-12 px-6 md:mt-32 md:px-12 lg:columns-2 xl:gap-x-20"
    >
      <Lightbox artworks={artworks}>
        {artworks.map((art, i) => (
          <ArtworkFigure key={art.src} art={art} index={i} />
        ))}
      </Lightbox>
    </section>
  )
}
