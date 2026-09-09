import type { Metadata } from 'next'
import { Gallery } from '@/components/gallery'
import { WallToggle } from '@/components/wall-toggle'
import { getArtworks, getSiteSettings } from '@/lib/content'
import { siteUrl } from '@/lib/site'

/** Search results cut around 160 characters; end on a whole word. */
function summarise(bio: string[]) {
  const text = bio.join(' ')
  if (text.length <= 160) return text
  return `${text.slice(0, 157).replace(/\s+\S*$/, '')}…`
}

export async function generateMetadata(): Promise<Metadata> {
  const [{ siteTitle, bio }, artworks] = await Promise.all([getSiteSettings(), getArtworks()])
  const description = summarise(bio)
  const cover = artworks[0]

  return {
    title: `${siteTitle} — paintings`,
    description,
    openGraph: {
      title: `${siteTitle} — paintings`,
      description,
      siteName: siteTitle,
        // cover.src, not cover.full: the lightbox source runs to 2600px, well
      // past what a link preview will ever show.
      images: cover ? [{ url: cover.src, alt: cover.alt || cover.title }] : undefined,
    },
  }
}

export default async function Page() {
  const [{ siteTitle, bio, footerNote }, artworks] = await Promise.all([
    getSiteSettings(),
    getArtworks(),
  ])

  // Tells search engines this is an artist and what hangs here, which the
  // markup alone cannot say — sizes and media are prose to a crawler.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VisualArtist',
    name: siteTitle,
    url: siteUrl,
    description: summarise(bio),
    makesOffer: artworks.map((art) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'VisualArtwork',
        name: art.title,
        image: art.full ?? art.src,
        artform: 'Painting',
        width: { '@type': 'QuantitativeValue', value: art.wcm, unitCode: 'CMT' },
        height: { '@type': 'QuantitativeValue', value: art.hcm, unitCode: 'CMT' },
        creator: { '@type': 'Person', name: siteTitle },
      },
    })),
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="mx-auto w-full max-w-[1320px] px-6 pt-20 md:px-12 md:pt-28">
        <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-6">
          <h1 className="wall-text">{siteTitle}</h1>
          <div className="shrink-0 pt-2">
            <WallToggle />
          </div>
        </div>

        <div className="mt-12 max-w-[58ch] space-y-5 text-[1.0625rem] leading-[1.55]">
          {bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-14 flex items-center gap-5">
          <span className="scale-bar" aria-hidden="true" />
          <p className="max-w-[34ch] text-[0.875rem] leading-snug text-muted-foreground">
            Works are shown to scale. This bar is 10 centimetres.
          </p>
        </div>
      </header>

      <Gallery artworks={artworks} />

      <footer className="mx-auto w-full max-w-[1320px] px-6 md:px-12">
        <div className="border-t border-[var(--hairline)] pb-24 pt-16 md:pb-32 md:pt-20">
          <p className="max-w-[52ch] text-[1.0625rem] leading-[1.55]">{footerNote}</p>
          <p className="wall-text-closing mt-16">{siteTitle}</p>
        </div>
      </footer>
    </main>
  )
}
