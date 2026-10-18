import type { Metadata } from 'next'
import { Gallery } from '@/components/gallery'
import { WallToggle } from '@/components/wall-toggle'
import { getArtworks, getSiteSettings } from '@/lib/content'
import { siteUrl } from '@/lib/site'
import styles from './page.module.css'

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
    <main id="top" className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <a href="#works" className={styles.skip}>Skip to works</a>
      <header className={styles.header}>
        <details className={styles.about}>
          <summary aria-label="About the artist" title="About the artist">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
              <path d="M5 3.5h12.5v16H5a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2Z" />
              <path d="M6 3.5v13M3 17.5a2 2 0 0 1 2-2h12.5M8 20.5h12V5.5" />
            </svg>
          </summary>
          <div className={styles.panel}>
            <p className={styles.eyebrow}>Independent artist · Selected paintings</p>
            <h2>{siteTitle}</h2>
            <div className={styles.bio}>
              {bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <p className={styles.note}>{footerNote}</p>
          </div>
        </details>
        <h1 className={styles.brand}><a href="#top" aria-label={`${siteTitle} — home`}>{siteTitle}</a></h1>
        <div className={styles.controls}><WallToggle /></div>
      </header>

      <Gallery artworks={artworks} />

      <footer className={styles.footer}>
        <p>{siteTitle} © {new Date().getFullYear()}<br />Original paintings. Nothing else.</p>
        <p>{String(artworks.length).padStart(2, '0')} works in the collection</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  )
}
